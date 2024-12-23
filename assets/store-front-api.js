const client = ShopifyStorefrontAPIClient.createStorefrontApiClient({
  storeDomain: Shopify.shop,
  apiVersion: '2024-10',
  publicAccessToken: '5d2a18b43a2a6006608cd6ffcd6dc28e',
});


// getProductBySkuId

const getProductBySkuIdStr = `
  query getMultipleVariants($variantIds: [ID!]!) {
  nodes(ids: $variantIds) {
    ... on ProductVariant {
      id
      title
      product {
        id
        title
        description
        variants(first: 10) {
          nodes {
            id
            title
            sku

          }
        }
      }
    }
  }
}
`;

async function getProductBySkuId(skuId) {
  try {
    const data = await client.request(getProductBySkuIdStr, {
        variables: {
          variantIds: [skuId],
        },
      });
    return data;
  } catch (error) { 
    console.error('Error updating cart attributes:', error.message);
  }
}
