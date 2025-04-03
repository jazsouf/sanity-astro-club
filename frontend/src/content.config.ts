import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { getAllCreators, getAllProducts } from './data/sanity';


const products = defineCollection({
  loader: async () => {
    const result = await getAllProducts();
    return result.data
  },
  schema: z.object({
    _id: z.string(),
    _type: z.string(),
    _createdAt: z.string(),
    _updatedAt: z.string(),
    status: z.string(),
    slug: z.string(),
    name: z.string(),
    publishedAt: z.date(),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    publishDate: z.date(),
    tracks: z.array(z.string()),
    artist: reference('artists'),
  }),
});

const creators = defineCollection({
  loader: async () => {
    const result = await getAllCreators();
    return result.data
  },
  schema: z.object({
    name: z.string(),
    image: z.object({
      ref: z.string(),
      alt: z.string(),
    }),
    publishedAt: z.date(),
    tracks: z.array(z.string()),
    artist: reference('artists'),
  }),
});

const artists = defineCollection({
  loader: glob({ pattern: '**/*.md', base: "./src/data/artists" }),
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
  loader: glob({ pattern: '**/*.md', base: "./src/data/albums" }),
  schema: z.object({
    name: z.string(),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    publishDate: z.date(), // e.g. 2024-09-17
    tracks: z.array(z.string()),
    artist: reference('artists'),
  }),
});


// Export all collections
export const collections = {artists, albums, products, creators};
