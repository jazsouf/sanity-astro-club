import { defineQuery } from "groq";

const creatorBaseFields = /* groq */ `
  _id,
  _type,
  _createdAt,
  _updatedAt,
  "status": select(_id in path("drafts.**") => "draft", "published"),
  "id": slug.current,
  "slug": slug.current,
  "name": coalesce(name, "Untitled"),
  "alias": coalesce(alias, ^.name),
  "image": {
    "ref": image.asset.ref,
    "alt" : image.alt
  },
`;

const productBaseFields = /* groq */ `
  _id,
  _type,
  _createdAt,
  _updatedAt,
  "status": select(_id in path("drafts.**") => "draft", "published"),
  "id": slug.current,
  "slug": slug.current,
  name,
  publishedAt,
  "image": {
    "ref": image.asset.ref,
    "alt" : image.alt
  },
  sku,
`;



export const ALL_CREATORS_QUERY = defineQuery(`
  *[_type == "creator"] {
    ${creatorBaseFields}
    "products": *[_type == "product" && creator._ref == ^._id] {
      ${productBaseFields}
    }
  }
`);


export const ALL_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product"] {
    ${productBaseFields}
    creator->{
      ${creatorBaseFields}
    }
  }
`);
