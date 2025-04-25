import type { QueryParams } from "@sanity/client";

import { client } from "./client";

export async function sanityFetch<QueryResponse>({
	query,
	params = {},
}: {
	query: string;
	params?: QueryParams;
}) {
	const { result } = await client.fetch<QueryResponse>(query, params ?? {}, {
		perspective: "published",
		filterResponse: false,
		resultSourceMap: false,
	});

	return {
		data: result,
	};
}
