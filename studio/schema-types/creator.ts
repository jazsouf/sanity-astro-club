import { defineField, defineType } from "sanity";

export const creator = defineType({
  __experimental_formPreviewTitle: false,
  name: "creator",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alias",
      title: "Alias",
      type: "string",
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
      name: "imageWithAlt",
      type: "imageWithAlt",
      validation: (rule) => rule.required(),
    }),
  ],
});
