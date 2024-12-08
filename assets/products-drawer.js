class ProductsDrawer extends HTMLElement {
  constructor() {
    super();
    
    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelector('#ProductsDrawer-Overlay').addEventListener('click', this.close.bind(this));
  }

  open() {
    this.classList.remove('twcss-invisible');
    this.querySelector('.twcss-drawer-inner').classList.remove('twcss-translate-x-full');
    this.querySelector('#ProductsDrawer-Overlay').classList.remove('twcss-invisible', 'twcss-opacity-0');
    
    // Prevent page scrolling
    document.body.classList.add('overflow-hidden');
    
    // Focus on drawer
    trapFocus(this.querySelector('.twcss-drawer-inner'));
  }

  close() {
    this.classList.add('twcss-invisible');
    this.querySelector('.twcss-drawer-inner').classList.add('twcss-translate-x-full');
    this.querySelector('#ProductsDrawer-Overlay').classList.add('twcss-invisible', 'twcss-opacity-0');
    
    // Re-enable page scrolling
    document.body.classList.remove('overflow-hidden');
    
    removeTrapFocus();
  }
}

customElements.define('products-drawer', ProductsDrawer);

class ProductsToggle extends HTMLElement {
  constructor() {
    super();
    
    this.addEventListener('click', this.handleClick.bind(this));
  }
  
  handleClick() {
    const drawer = document.querySelector('products-drawer');
    if (drawer) drawer.open();
  }
}

customElements.define('products-toggle', ProductsToggle); 