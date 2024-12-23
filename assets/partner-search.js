class PartnerSearch extends PredictiveSearch {
  constructor() {
    super();
    this.companyId = this.getAttribute('data-id');
  }

  getProductByPartnerNumber(partnerNumber) {
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

    return fetch(
      'http://b2b-customer-account-app-szwh.vercel.app/api/v1/product/customer-partner-number-search',
      requestOptions,
    )
      .then((response) => response.text())
  }

  getSearchResults(searchTerm) {
    this.getProductByPartnerNumber(searchTerm).then((data)=>{
      console.log(data);
    }).catch((error)=>{
      super.getSearchResults(searchTerm);
    });
  }
}

customElements.define('partner-search', PartnerSearch);
