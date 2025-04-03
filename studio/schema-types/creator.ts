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
      validation: (Rule) => Rule.required(),
      options: {
        source: "name",
        maxLength: 96,
      },
    }),
    defineField({
      name: "image",
      type: "imageWithAlt",
    }),
  ],
});
