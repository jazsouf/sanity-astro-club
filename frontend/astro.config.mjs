// @ts-check
import { defineConfig, envField } from "astro/config";
import { loadEnv } from "vite";

import sitemap from "@astrojs/sitemap";

const { SITE_URL } = loadEnv(process.env.NODE_ENV, process.cwd(), "");

// https://astro.build/config
export default defineConfig({
	devToolbar: {
		enabled: false,
	},
	prefetch: true,
	trailingSlash: "never",
	site: SITE_URL,
	integrations: [sitemap()],
	image: {
		domains: ["cdn.sanity.io"],
		remotePatterns: [{ protocol: "https" }],
	},
	vite: {
		server: {
			// // enable cloudflare tunnel
			// allowedHosts: true,
		},
		css: {
			devSourcemap: true,
		},
	},
	env: {
		schema: {
			SITE_URL: envField.string({
				context: "client",
				access: "public",
			}),
			POLAR_ACCESS_TOKEN: envField.string({
				context: "server",
				access: "secret",
			}),
			SANITY_STUDIO_PROJECT_ID: envField.string({
				context: "client",
				access: "public",
			}),
			SANITY_STUDIO_DATASET: envField.string({
				context: "client",
				access: "public",
				default: "production",
			}),
		},
	},
});
