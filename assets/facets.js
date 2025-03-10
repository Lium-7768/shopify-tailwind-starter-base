class FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    this.onActiveFilterClick = this.onActiveFilterClick.bind(this);

    this.debouncedOnSubmit = debounce((event) => {
      this.onSubmitHandler(event);
    }, 500);

    const facetForm = this.querySelector('form');
    facetForm.addEventListener('input', this.debouncedOnSubmit.bind(this));

    const facetWrapper = this.querySelector('#FacetsWrapperDesktop');
    if (facetWrapper) facetWrapper.addEventListener('keyup', onKeyUpEscape);

    // Initialize page_size from sessionStorage
    const storedPageSize = sessionStorage.getItem('collection-page-size');
    if (storedPageSize) {
      const pageSizeSelect = document.getElementById('PageSize');
      if (pageSizeSelect) {
        pageSizeSelect.value = storedPageSize;
      }
    }

    // Add view switcher handlers
    this.initializeViewSwitcher();
  }

  static setListeners() {
    const onHistoryChange = (event) => {
      const searchParams = event.state
        ? event.state.searchParams
        : FacetFiltersForm.searchParamsInitial;
      if (searchParams === FacetFiltersForm.searchParamsPrev) return;
      FacetFiltersForm.renderPage(searchParams, null, false);
    };
    window.addEventListener('popstate', onHistoryChange);
  }

  static toggleActiveFacets(disable = true) {
    document.querySelectorAll('.js-facet-remove').forEach((element) => {
      element.classList.toggle('disabled', disable);
    });
  }

  static getCurrentPageSize() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlPageSize = urlParams.get('page_size');
    if (urlPageSize) {
      return urlPageSize;
    }

    return '12';
  }

  static renderPage(searchParams, event, updateURLHash = true) {
    const isRemoveAll =
      event?.target &&
      event.target
        .closest('active-filters')
        ?.querySelector('.active-filters__clear')
        ?.contains(event.target);

    const currentPageSize = this.getCurrentPageSize();

    if (isRemoveAll) {
      // If it's "remove all", only keep page_size if it exists
      searchParams = currentPageSize ? `page_size=${currentPageSize}` : '';
    } else if (currentPageSize && !searchParams.includes('page_size=')) {
      // Add page_size to searchParams if it exists but isn't included
      searchParams = searchParams
        ? `${searchParams}&page_size=${currentPageSize}`
        : `page_size=${currentPageSize}`;
    }

    if (window.location.pathname.includes('search')) {
      searchParams = `${searchParams}&type=product`;
    }

    FacetFiltersForm.searchParamsPrev = searchParams;
    const sections = FacetFiltersForm.getSections();
    const countContainer = document.getElementById('ProductCount');
    const countContainerDesktop = document.getElementById(
      'ProductCountDesktop',
    );
    document
      .getElementById('ProductGridContainer')
      .querySelector('.collection')
      .classList.add('loading');
    if (countContainer) {
      countContainer.classList.add('loading');
    }
    if (countContainerDesktop) {
      countContainerDesktop.classList.add('loading');
    }

    sections.forEach((section) => {
      const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
      const filterDataUrl = (element) => element.url === url;

      FacetFiltersForm.filterData.some(filterDataUrl)
        ? FacetFiltersForm.renderSectionFromCache(filterDataUrl, event)
        : FacetFiltersForm.renderSectionFromFetch(url, event);
    });

    if (updateURLHash) FacetFiltersForm.updateURLHash(searchParams);
  }

  static renderSectionFromFetch(url, event) {
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => {
        const html = responseText;
        FacetFiltersForm.filterData = [
          ...FacetFiltersForm.filterData,
          { html, url },
        ];
        FacetFiltersForm.renderFilters(html, event);
        FacetFiltersForm.renderProductGridContainer(html);
        FacetFiltersForm.renderProductCount(html);
      });
  }

  static renderSectionFromCache(filterDataUrl, event) {
    const html = FacetFiltersForm.filterData.find(filterDataUrl).html;
    FacetFiltersForm.renderFilters(html, event);
    FacetFiltersForm.renderProductGridContainer(html);
    FacetFiltersForm.renderProductCount(html);
  }

  static renderProductGridContainer(html) {
    document.getElementById('ProductGridContainer').innerHTML = new DOMParser()
      .parseFromString(html, 'text/html')
      .getElementById('ProductGridContainer').innerHTML;

    const pageSizeSelect = document.getElementById('PageSize');
    if (pageSizeSelect) {
      const storedPageSize = sessionStorage.getItem('collection-page-size');
      if (storedPageSize) {
        pageSizeSelect.value = storedPageSize;
      } else {
        pageSizeSelect.value = '12';
        sessionStorage.setItem('collection-page-size', '12');
      }
    }

    document.querySelectorAll('facet-filters-form').forEach((form) => {
      form.initializeViewSwitcher();
    });
  }

  static renderProductCount(html) {
    const count = new DOMParser()
      .parseFromString(html, 'text/html')
      .getElementById('ProductCount').innerHTML;
    const container = document.getElementById('ProductCount');
    const containerDesktop = document.getElementById('ProductCountDesktop');
    container.innerHTML = count;
    container.classList.remove('loading');
    if (containerDesktop) {
      containerDesktop.innerHTML = count;
      containerDesktop.classList.remove('loading');
    }
  }

  static renderFilters(html, event) {
    const parsedHTML = new DOMParser().parseFromString(html, 'text/html');

    const facetDetailsElements = parsedHTML.querySelectorAll(
      '#FacetFiltersForm .js-filter, #FacetFiltersFormMobile .js-filter, #FacetFiltersPillsForm .js-filter',
    );
    const matchesIndex = (element) => {
      const jsFilter = event ? event.target.closest('.js-filter') : undefined;
      return jsFilter
        ? element.dataset.index === jsFilter.dataset.index
        : false;
    };
    const facetsToRender = Array.from(facetDetailsElements).filter(
      (element) => !matchesIndex(element),
    );
    const countsToRender = Array.from(facetDetailsElements).find(matchesIndex);

    facetsToRender.forEach((element) => {
      document.querySelector(
        `.js-filter[data-index="${element.dataset.index}"]`,
      ).innerHTML = element.innerHTML;
    });

    FacetFiltersForm.renderActiveFacets(parsedHTML);
    FacetFiltersForm.renderAdditionalElements(parsedHTML);

    if (countsToRender)
      FacetFiltersForm.renderCounts(
        countsToRender,
        event.target.closest('.js-filter'),
      );
  }

  static renderActiveFacets(html) {
    const activeFacetElementSelectors = [
      '.active-facets-mobile',
      '.active-facets-desktop',
    ];

    activeFacetElementSelectors.forEach((selector) => {
      const activeFacetsElement = html.querySelector(selector);
      if (!activeFacetsElement) return;
      document.querySelector(selector).innerHTML =
        activeFacetsElement.innerHTML;
    });

    FacetFiltersForm.toggleActiveFacets(false);
  }

  static renderAdditionalElements(html) {
    const mobileElementSelectors = [
      '.mobile-facets__open',
      '.mobile-facets__count',
      '.sorting',
    ];

    mobileElementSelectors.forEach((selector) => {
      if (!html.querySelector(selector)) return;
      document.querySelector(selector).innerHTML =
        html.querySelector(selector).innerHTML;
    });

    document
      .getElementById('FacetFiltersFormMobile')
      .closest('menu-drawer')
      .bindEvents();
  }

  static renderCounts(source, target) {
    const targetElement = target.querySelector('.facets__selected');
    const sourceElement = source.querySelector('.facets__selected');

    const targetElementAccessibility = target.querySelector('.facets__summary');
    const sourceElementAccessibility = source.querySelector('.facets__summary');

    if (sourceElement && targetElement) {
      target.querySelector('.facets__selected').outerHTML =
        source.querySelector('.facets__selected').outerHTML;
    }

    if (targetElementAccessibility && sourceElementAccessibility) {
      target.querySelector('.facets__summary').outerHTML =
        source.querySelector('.facets__summary').outerHTML;
    }
  }

  static updateURLHash(searchParams) {
    const currentPageSize = this.getCurrentPageSize();

    let newSearchParams = searchParams;

    // If we have a current page_size and it's not in the new params
    if (currentPageSize && !searchParams.includes('page_size=')) {
      newSearchParams = searchParams
        ? `${searchParams}&page_size=${currentPageSize}`
        : `page_size=${currentPageSize}`;
    }

    // If searchParams is empty but we have a page_size, use only page_size
    if (!searchParams && currentPageSize) {
      newSearchParams = `page_size=${currentPageSize}`;
    }

    // Update URL
    history.pushState(
      { searchParams: newSearchParams },
      '',
      `${window.location.pathname}${
        newSearchParams ? '?'.concat(newSearchParams) : ''
      }`,
    );
  }

  static getSections() {
    return [
      {
        section: document.getElementById('product-grid').dataset.id,
      },
    ];
  }

  createSearchParams(form) {
    const formData = new FormData(form);
    return new URLSearchParams(formData).toString();
  }

  onSubmitForm(searchParams, event) {
    FacetFiltersForm.renderPage(searchParams, event);
  }

  onSubmitHandler(event) {
    event.preventDefault();
    const sortFilterForms = document.querySelectorAll(
      'facet-filters-form form',
    );
    const currentForm = event.target.closest('form');

    // Handle PageSize change
    if (currentForm?.id === 'FacetPerPageForm') {
      const pageSize = currentForm.querySelector('#PageSize')?.value;
      if (pageSize) {
        sessionStorage.setItem('collection-page-size', pageSize);

        const forms = [];
        sortFilterForms.forEach((form) => {
          if (
            form.id === 'FacetSortForm' ||
            form.id === 'FacetFiltersForm' ||
            form.id === 'FacetSortDrawerForm'
          ) {
            const noJsElements = document.querySelectorAll('.no-js-list');
            noJsElements.forEach((el) => el.remove());
            forms.push(this.createSearchParams(form));
          }
        });

        forms.push(`page_size=${pageSize}`);

        const searchParams = forms.join('&');
        this.onSubmitForm(searchParams, event);
        return;
      }
    }

    // Normal form submission logic
    if (event.srcElement.className == 'mobile-facets__checkbox') {
      const searchParams = this.createSearchParams(
        event.target.closest('form'),
      );
      this.onSubmitForm(searchParams, event);
    } else {
      const forms = [];
      const isMobile = currentForm.id === 'FacetFiltersFormMobile';

      sortFilterForms.forEach((form) => {
        if (!isMobile) {
          if (
            form.id === 'FacetSortForm' ||
            form.id === 'FacetFiltersForm' ||
            form.id === 'FacetSortDrawerForm' ||
            form.id === 'FacetPerPageForm'
          ) {
            const noJsElements = document.querySelectorAll('.no-js-list');
            noJsElements.forEach((el) => el.remove());
            forms.push(this.createSearchParams(form));
          }
        } else if (form.id === 'FacetFiltersFormMobile') {
          forms.push(this.createSearchParams(form));
        }
      });
      this.onSubmitForm(forms.join('&'), event);
    }
  }

  onActiveFilterClick(event) {
    event.preventDefault();
    FacetFiltersForm.toggleActiveFacets();

    // Check if this is a "remove all" operation
    // const isRemoveAll = event.target
    //   .closest('active-filters')
    //   ?.querySelector('.active-filters__clear')
    //   ?.contains(event.target);

    // if (isRemoveAll) {
    //   FacetFiltersForm.renderPage('', event);
    // } else {
    //   const url =
    //     event.currentTarget.href.indexOf('?') == -1
    //       ? ''
    //       : event.currentTarget.href.slice(
    //           event.currentTarget.href.indexOf('?') + 1,
    //         );
    //   FacetFiltersForm.renderPage(url, event);
    // }

    const url =
      event.currentTarget.href.indexOf('?') == -1
        ? ''
        : event.currentTarget.href.slice(
            event.currentTarget.href.indexOf('?') + 1,
          );
    FacetFiltersForm.renderPage(url);
  }

  initializeViewSwitcher() {
    const gridButton = document.querySelector('[data-view="grid"]');
    const listButton = document.querySelector('[data-view="list"]');
    const productGrid = document.getElementById('product-grid');

    if (!gridButton || !listButton || !productGrid) return;

    // Check window width and force list view on mobile
    const isMobile = window.innerWidth <= 749;
    let currentView = sessionStorage.getItem('collection-view-mode') || 'grid';

    // Force list view on mobile
    if (isMobile) {
      currentView = 'list';
      sessionStorage.setItem('collection-view-mode', 'list');
    }

    // Apply the current view
    this.switchView(currentView, { gridButton, listButton, productGrid });

    // Add resize listener to handle view changes on window resize
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const currentView = sessionStorage.getItem('collection-view-mode');

      if (width <= 749 && currentView !== 'list') {
        this.switchView('list', { gridButton, listButton, productGrid });
      }
    });

    gridButton.addEventListener('click', () => {
      // Only allow grid view on desktop
      if (window.innerWidth > 749) {
        this.switchView('grid', { gridButton, listButton, productGrid });
      }
    });

    listButton.addEventListener('click', () => {
      this.switchView('list', { gridButton, listButton, productGrid });
    });
  }

  switchView(view, elements) {
    const { gridButton, listButton, productGrid } = elements;

    if (!gridButton || !listButton || !productGrid) return;

    // Check if we're on mobile
    const isMobile = window.innerWidth <= 749;

    // Don't allow switching to grid view on mobile
    if (isMobile && view === 'grid') {
      return;
    }

    // First update the storage
    sessionStorage.setItem('collection-view-mode', view);

    // Then update the grid/list class
    if (view === 'grid') {
      productGrid.classList.remove('product-grid--list');
    } else {
      productGrid.classList.add('product-grid--list');
    }

    // Finally update button states
    if (view === 'grid') {
      // Grid button active state
      gridButton.classList.remove(
        'twcss-border-secondary-middle',
        'twcss-text-secondary-middle',
      );
      gridButton.classList.add(
        'twcss-border-secondary-default',
        'twcss-text-secondary-default',
        'active',
      );

      // List button inactive state
      listButton.classList.add(
        'twcss-border-secondary-middle',
        'twcss-text-secondary-middle',
      );
      listButton.classList.remove(
        'twcss-border-secondary-default',
        'twcss-text-secondary-default',
        'active',
      );
    } else {
      // List button active state
      listButton.classList.remove(
        'twcss-border-secondary-middle',
        'twcss-text-secondary-middle',
      );
      listButton.classList.add(
        'twcss-border-secondary-default',
        'twcss-text-secondary-default',
        'active',
      );

      // Grid button inactive state
      gridButton.classList.add(
        'twcss-border-secondary-middle',
        'twcss-text-secondary-middle',
      );
      gridButton.classList.remove(
        'twcss-border-secondary-default',
        'twcss-text-secondary-default',
        'active',
      );
    }
  }
}

FacetFiltersForm.filterData = [];
FacetFiltersForm.searchParamsInitial = window.location.search.slice(1);
FacetFiltersForm.searchParamsPrev = window.location.search.slice(1);
customElements.define('facet-filters-form', FacetFiltersForm);
FacetFiltersForm.setListeners();

class PriceRange extends HTMLElement {
  constructor() {
    super();
    this.querySelectorAll('input').forEach((element) =>
      element.addEventListener('change', this.onRangeChange.bind(this)),
    );
    this.setMinAndMaxValues();
  }

  onRangeChange(event) {
    this.adjustToValidValues(event.currentTarget);
    this.setMinAndMaxValues();
  }

  setMinAndMaxValues() {
    const inputs = this.querySelectorAll('input');
    const minInput = inputs[0];
    const maxInput = inputs[1];
    if (maxInput.value) minInput.setAttribute('max', maxInput.value);
    if (minInput.value) maxInput.setAttribute('min', minInput.value);
    if (minInput.value === '') maxInput.setAttribute('min', 0);
    if (maxInput.value === '')
      minInput.setAttribute('max', maxInput.getAttribute('max'));
  }

  adjustToValidValues(input) {
    const value = Number(input.value);
    const min = Number(input.getAttribute('min'));
    const max = Number(input.getAttribute('max'));

    if (value < min) input.value = min;
    if (value > max) input.value = max;
  }
}

customElements.define('price-range', PriceRange);

class FacetRemove extends HTMLElement {
  constructor() {
    super();
    const facetLink = this.querySelector('a');
    facetLink.setAttribute('role', 'button');
    facetLink.addEventListener('click', this.closeFilter.bind(this));
    facetLink.addEventListener('keyup', (event) => {
      event.preventDefault();
      if (event.code.toUpperCase() === 'SPACE') this.closeFilter(event);
    });
  }

  closeFilter(event) {
    event.preventDefault();
    const form =
      this.closest('facet-filters-form') ||
      document.querySelector('facet-filters-form');
    form.onActiveFilterClick(event);
  }
}

customElements.define('facet-remove', FacetRemove);
