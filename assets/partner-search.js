class PartnerSearch extends SearchForm {
  constructor() {
    super();
  }

  getProductByPartnerNumber(partnerNumber) {
    const myHeaders = new Headers();
    myHeaders.append('accept', 'application/json');
    myHeaders.append('Content-Type', 'application/json');
    const customerData = JSON.parse(this.getAttribute('data-customer'));

    const raw = JSON.stringify({
      storeName: window.Shopify.shop,
      companyId: customerData.current_company.id,
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
