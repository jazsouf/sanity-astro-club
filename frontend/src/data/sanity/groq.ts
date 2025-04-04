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
  "image": {
    "ref": image.asset.ref,
    "alt" : image.alt
  },
  sku,
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
  "image": {
    "ref": image.asset.ref,
    "alt" : image.alt
  },
`;

export const ALL_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product"] {
    ${productBaseFields}
    creator->{
      ${creatorBaseFields}
    }
  }
`);

export const ALL_CREATORS_QUERY = defineQuery(`
  *[_type == "creator"] {
    ${creatorBaseFields}
    "products": *[_type == "product" && creator._ref == ^._id] {
      ${productBaseFields}
    }
  }
`);
