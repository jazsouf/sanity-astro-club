import {POLAR_ACCESS_TOKEN} from "astro:env/server"

const options = {method: 'GET', headers: {Authorization: `Bearer ${POLAR_ACCESS_TOKEN}`}};

export async function getProductById(sku: string) {

  const res = await fetch(`https://api.polar.sh/v1/products/${sku}`, options)
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
