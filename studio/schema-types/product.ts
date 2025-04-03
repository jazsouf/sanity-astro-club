import { defineField, defineType } from "sanity";
import { ProductSelector } from "../components/product-selector";

export const product = defineType({
  __experimental_formPreviewTitle: false,
  name: "product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      validation: (Rule) => Rule.required(),
      options: {
        source: "name",
        maxLength: 96,
      },
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
    }),
    defineField({
      name: "creator",
      title: "Creator",
      type: "reference",
      to: [{ type: "creator" }],
    }),
    defineField({
      name: "image",
      type: "imageWithAlt",
    }),
    defineField({
      name: "sku",
      title: "SKU",
      type: "string",
      components: {
        input: ProductSelector,
      },
    }),
  ],
});
