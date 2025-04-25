import { SITE_URL } from "astro:env/client";
import { POLAR_ACCESS_TOKEN } from "astro:env/server";

const getOptions = {
	method: "GET",
	headers: { Authorization: `Bearer ${POLAR_ACCESS_TOKEN}` },
};
const postOptions = {
	method: "POST",
	headers: {
		Authorization: `Bearer ${POLAR_ACCESS_TOKEN}`,
		"Content-Type": "application/json",
	},
};

export async function getProductById(sku: string) {
	const res = await fetch(`https://api.polar.sh/v1/products/${sku}`, getOptions)
		.then((response) => response.json())
		.catch((err) => console.error(err));

	return {
		sku: sku,
		name: res.name,
		price: {
			amount: res?.prices[0]?.price_amount,
			currency: res?.prices[0]?.price_currency,
		},
	};
}

export async function getCheckoutSession(skus: string[]) {
	const body = JSON.stringify({
		allow_discount_codes: false,
		require_billing_address: false,
		products: skus,
		success_url: `${SITE_URL}/success`,
	});

	const res = await fetch("https://api.polar.sh/v1/checkouts/", {
		...postOptions,
		body,
	})
		.then((response) => response.json())
		.catch((err) => console.error(err));

	return {
		initialUrl: res.url,
		clientSecret: res.client_secret,
	};
}
