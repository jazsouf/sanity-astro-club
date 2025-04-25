import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";
import { getProductById } from "./data/polar";
import { getAllCreators, getAllProducts } from "./data/sanity";

const products = defineCollection({
	loader: async () => {
		const result = await getAllProducts();

		const productsWithPrice = await Promise.all(
			result.data.map(async (product) => {
				const sku = product.sku;
				if (typeof sku !== "string") {
					return { ...product };
				}
				const polarData = await getProductById(sku);
				return {
					...product,
					price: polarData.price,
				};
			}),
		);
		return productsWithPrice;
	},
	schema: z.object({
		_id: z.string(),
		_type: z.string(),
		_createdAt: z.string(),
		_updatedAt: z.string(),
		status: z.string(),
		slug: z.string(),
		name: z.string(),
		publishedAt: z.string().optional(),
		imageWithAlt: z.object({
			ref: z.string(),
			alt: z.string(),
		}),
		content: z.array(z.unknown()),
		sku: z.string().optional(),
		price: z
			.object({
				amount: z.number(),
				currency: z.string(),
			})
			.optional(),
		creator: reference("creators"),
	}),
});

const creators = defineCollection({
	loader: async () => {
		const result = await getAllCreators();
		return result.data;
	},
	schema: z.object({
		_id: z.string(),
		_type: z.string(),
		_createdAt: z.string(),
		_updatedAt: z.string(),
		status: z.string(),
		slug: z.string(),
		name: z.string(),
		alias: z.string().optional(),
		imageWithAlt: z.object({
			ref: z.string(),
			alt: z.string(),
		}),
		content: z.array(z.unknown()),
		products: z.array(reference("products")),
	}),
});

const artists = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/data/artists" }),
	schema: z.object({
		name: z.string(),
		stage_name: z.string(),
		genre: z.string(),
		image: z.object({
			src: z.string(),
			alt: z.string(),
		}),
	}),
});

const albums = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/data/albums" }),
	schema: z.object({
		name: z.string(),
		image: z.object({
			src: z.string(),
			alt: z.string(),
		}),
		publishDate: z.date(), // e.g. 2024-09-17
		tracks: z.array(z.string()),
		artist: reference("artists"),
	}),
});

// Export all collections
export const collections = { artists, albums, products, creators };
