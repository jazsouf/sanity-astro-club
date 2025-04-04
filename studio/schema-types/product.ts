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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      validation: (rule) => rule.required(),
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
      validation: (rule) => rule.required(),
      to: [{ type: "creator" }],
    }),
    defineField({
      name: "imageWithAlt",
      type: "imageWithAlt",
      validation: (rule) => rule.required(),
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
