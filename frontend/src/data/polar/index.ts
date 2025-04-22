import { POLAR_ACCESS_TOKEN } from "astro:env/server";

const getOptions = {method: 'GET', headers: {Authorization: `Bearer ${POLAR_ACCESS_TOKEN}`}};
const postOptions = {method: 'POST', headers: {Authorization: `Bearer ${POLAR_ACCESS_TOKEN}`}};

export async function getProductById(sku: string) {

  const res = await fetch(`https://api.polar.sh/v1/products/${sku}`, getOptions)
    .then(response => response.json())
    .catch(err => console.error(err));

  return {
    sku: sku,
    name: res.name,
    price: {
      amount:res?.prices[0]?.price_amount,
      currency: res?.prices[0]?.price_currency,
    }
  }
}

export async function getCheckoutSession(skus: string[]) {
  const body = JSON.stringify({
      products: skus // Use "products" as the key instead of "skus"
    });

  const res = await fetch('https://api.polar.sh/v1/checkouts/', {...postOptions, body: JSON.stringify({skus})})
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));

  console.log({res});

}
