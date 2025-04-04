import { defineQuery } from "groq";

const productBaseFields = /* groq */ `
  "id": slug.current,
  _id,
  _type,
  _createdAt,
  _updatedAt,
  "status": select(_id in path("drafts.**") => "draft", "published"),
  "slug": slug.current,
  name,
  publishedAt,
  imageWithAlt {
    "ref": asset._ref,
    alt,
  },
  sku,
  content,
`;

const creatorBaseFields = /* groq */ `
  "id": slug.current,
  _id,
  _type,
  _createdAt,
  _updatedAt,
  "status": select(_id in path("drafts.**") => "draft", "published"),
  "slug": slug.current,
  "name": coalesce(name, "Untitled"),
  "alias": coalesce(alias, ^.name),
  imageWithAlt {
    "ref": asset._ref,
    alt,
  },
  content,
`;

export const ALL_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product"] {
    ${productBaseFields}
    "creator" : creator->.slug.current,
  }
`);

export const ALL_CREATORS_QUERY = defineQuery(`
  *[_type == "creator"] {
    ${creatorBaseFields}
    "products": *[_type == "product" && creator._ref == ^._id].slug.current,
  }
`);
