class PartnerSearch extends PredictiveSearch {
  constructor() {
    super();
    this.companyId = this.getAttribute('data-id');
    this.debounceTimer = null;
  }

  getProductByPartnerNumber(partnerNumber) {
    return new Promise((resolve, reject) => {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      this.debounceTimer = setTimeout(() => {
        const myHeaders = new Headers();
        myHeaders.append('accept', 'application/json');
        myHeaders.append('Content-Type', 'application/json');

        const raw = JSON.stringify({
          storeName: window.Shopify.shop,
          companyId: this.companyId,
          customerPartnerNumber: partnerNumber,
        });

        const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow',
        };

        fetch(
          'http://b2b-customer-account-app-szwh.vercel.app/api/v1/product/customer-partner-number-search',
          requestOptions,
        )
          .then((response) => response.json())
          .then(resolve)
          .catch(reject);
      }, 300); // 300ms debounce delay
    });
  }

  getSearchResults(searchTerm) {
    super.setLiveRegionLoadingState();
    this.getProductByPartnerNumber(searchTerm).then((data)=>{
      if(!data.skuId) {
        throw new Error('No product found');
      }else{
        getProductById( `gid://shopify/Product/${data.skuId}`).then((product)=>{
          console.log(product);
        });
      } 
    }).catch((error)=>{
      super.getSearchResults(searchTerm);
    });
  }
}

customElements.define('partner-search', PartnerSearch);
