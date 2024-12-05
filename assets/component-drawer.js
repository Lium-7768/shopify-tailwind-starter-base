class ComponentDrawer {
  constructor() {
    this.drawer = document.getElementById('products-drawer');
    this.content = this.drawer.querySelector('[data-drawer-content]');
    this.backdrop = this.drawer.querySelector('[data-drawer-backdrop]');
    this.triggers = document.querySelectorAll(
      '[data-drawer-trigger="products"]',
    );
    this.closeButtons = document.querySelectorAll('[data-drawer-close]');

    this.isOpen = false;

    this.init();
  }

  init() {
    // Add click handlers to all trigger buttons
    this.triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => this.toggle());
    });

    // Add click handlers to all close buttons
    this.closeButtons.forEach((button) => {
      button.addEventListener('click', () => this.close());
    });

    // Close drawer when clicking backdrop
    this.backdrop.addEventListener('click', () => this.close());

    // Close drawer when pressing Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    if (this.isOpen) return;

    this.isOpen = true;
    this.drawer.classList.remove('twcss-hidden');
    requestAnimationFrame(() => {
      this.drawer.classList.remove('twcss-translate-x-[-100%]');
      this.backdrop.classList.remove('twcss-opacity-0');
    });
    document.body.style.overflow = 'hidden';

    // Update ARIA attributes
    this.drawer.setAttribute('aria-hidden', 'false');
    this.triggers.forEach((trigger) =>
      trigger.setAttribute('aria-expanded', 'true'),
    );
  }

  close() {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.drawer.classList.add('twcss-translate-x-[-100%]');
    this.backdrop.classList.add('twcss-opacity-0');

    // Wait for animation to finish before hiding
    setTimeout(() => {
      this.drawer.classList.add('twcss-hidden');
      document.body.style.overflow = '';
    }, 300);

    // Update ARIA attributes
    this.drawer.setAttribute('aria-hidden', 'true');
    this.triggers.forEach((trigger) =>
      trigger.setAttribute('aria-expanded', 'false'),
    );
  }
}

// Initialize drawer when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ComponentDrawer());
} else {
  new ComponentDrawer();
}
