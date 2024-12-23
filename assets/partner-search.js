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
      data: {
        customerPartnerNumber: partnerNumber,
      },
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
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  }

  getSearchResults(searchTerm) {
    this.getProductByPartnerNumber(searchTerm);
    super.getSearchResults(searchTerm);
  }
}

customElements.define('partner-search', PartnerSearch);
