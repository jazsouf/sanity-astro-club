import { defineField, defineType } from "sanity";

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  type: "image",
  fields: [
    defineField({
      name: "alt",
      type: "string",
      title: "Alternative text",
      description: "Important for SEO and accessibility.",
      validation: (rule) => {
        return rule.custom((alt, context) => {
          if ((context.parent as any)?.asset?._ref && !alt) {
            return "Alt text is required";
          }
          return true;
        });
      },
    }),
  ],
  options: {
    hotspot: true,
  },
  validation: (rule) => rule.required(),
  preview: {
    select: {
      alt: "alt",
      image: "image",
    },
    prepare({ alt, image }) {
      console.log({ image });
      return {
        media: image ?? null,
      };
    },
  },
});
