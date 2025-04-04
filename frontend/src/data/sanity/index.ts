import { ALL_CREATORS_QUERY, ALL_PRODUCTS_QUERY } from "./groq";
import { sanityFetch } from "./fetch";

export async function getAllCreators() {
  return sanityFetch<({id: string} & Record<string, unknown>)[]>({query: ALL_CREATORS_QUERY})
}

export async function getAllProducts() {
  return sanityFetch<({id: string} & Record<string, unknown>)[]>({query: ALL_PRODUCTS_QUERY})
}
