import { createClient } from "@sanity/client";

import {
	SANITY_STUDIO_DATASET,
	SANITY_STUDIO_PROJECT_ID,
} from "astro:env/client";

export const client = createClient({
	projectId: SANITY_STUDIO_PROJECT_ID,
	dataset: SANITY_STUDIO_DATASET,
	apiVersion: "2025-04-01",
	useCdn: true,
});
