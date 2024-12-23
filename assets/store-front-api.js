const client = ShopifyStorefrontAPIClient.createStorefrontApiClient({
  storeDomain: Shopify.shop,
  apiVersion: '2024-10',
  publicAccessToken: '5d2a18b43a2a6006608cd6ffcd6dc28e',
});


// getProductBySkuId

const getProductBySkuIdStr = `
  query suggestions($query: String!) {
    predictiveSearch(query: $query, searchableFields: [VARIANTS_SKU]) {
      products {
        id
        title
      }
    }
  }
`;

async function getProductBySkuId(skuId) {
  try {
    const data = await client.request(getProductBySkuIdStr, {
        variables: {
          skuId: skuId,
        },
      });
    return data;
  } catch (error) { 
    console.error('Error updating cart attributes:', error.message);
  }
}
