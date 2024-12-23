const client = ShopifyStorefrontAPIClient.createStorefrontApiClient({
  storeDomain: Shopify.shop,
  apiVersion: '2024-10',
  publicAccessToken: '5d2a18b43a2a6006608cd6ffcd6dc28e',
});


// getProductBySkuId

const getProductByIdStr = `
  query getProductById($id: ID!) {
    product(id: $id) {
      title
      id
    }
  }
`;

async function getProductById(id) {
  try {
    const data = await client.request(getProductByIdStr, {
        variables: {
          id: id,
        },
      });
    return data;
  } catch (error) { 
    console.error('Error updating cart attributes:', error.message);
  }
}
