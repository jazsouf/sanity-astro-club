import React, { use, useEffect, useMemo, useState } from "react";

import { Button, Card, Select, Text } from "@sanity/ui";

import { useSecrets } from "@sanity/studio-secrets";
import { Product } from "@polar-sh/sdk/models/components/product.js";
import { StringInputProps, set, unset } from "sanity";

export function ProductSelector(props: StringInputProps) {
  const { secrets } = useSecrets<{
    polarAccessTokenProducts: string;
  }>("secrets");

  // The onChange handler can write new changes to the field
  const { onChange, value } = props;

  const handleChange = React.useCallback(
    (event: React.FormEvent<HTMLSelectElement> | undefined) => {
      const value = event?.currentTarget.value;
      onChange(value ? set(value) : unset());
    },
    [onChange],
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!secrets) return;

    if (!secrets?.polarAccessTokenProducts) {
      setError("Failed to find access token");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetch("https://api.polar.sh/v1/products/?limit=100", {
      method: "GET",
      headers: { Authorization: `Bearer ${secrets.polarAccessTokenProducts}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
      })
      .then((response) => {
        console.log(response);
        setProducts(response.items || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load products");
        setIsLoading(false);
      });
  }, [secrets?.polarAccessTokenProducts]);

  if (isLoading) {
    return <Text>Loading products...</Text>;
  }

  if (error) {
    return (
      <Card padding={2} tone="critical">
        <Text>{error}</Text>
      </Card>
    );
  }

  if (!products.length) {
    return (
      <Card padding={2} tone="caution">
        <Text>No products found</Text>
      </Card>
    );
  }

  return (
    <>
      <Select onChange={handleChange} value={value}>
        <option value={""}>None</option>
        {products.map((item) => {
          const price = (item.prices?.[0] as any)?.priceAmount;
          return (
            <option key={item.id} value={item.id}>
              {item.name} {price ? `($${price})` : ""}
            </option>
          );
        })}
      </Select>
    </>
  );
}
