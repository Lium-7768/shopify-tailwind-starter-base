class Drawer {
  constructor() {
    this.overlay = document.querySelector('[data-drawer-overlay]');
    this.container = document.querySelector('[data-drawer-container]');
    this.trigger = document.querySelector('[data-drawer-trigger]');
    this.closeBtn = document.querySelector('[data-drawer-close]');

    this.isOpen = false;

    this.init();
  }

  init() {
    this.trigger?.addEventListener('click', () => this.open());
    this.closeBtn?.addEventListener('click', () => this.close());
    this.overlay?.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
  }

  open() {
    this.isOpen = true;
    this.overlay.classList.remove('twcss-hidden', 'twcss-opacity-0');
    this.container.classList.remove('-twcss-translate-x-full');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen = false;
    this.overlay.classList.add('twcss-opacity-0');
    this.container.classList.add('-twcss-translate-x-full');

    // Wait for animation to finish before hiding
    setTimeout(() => {
      this.overlay.classList.add('twcss-hidden');
      document.body.style.overflow = '';
    }, 300);
  }
}

// Initialize drawer
document.addEventListener('DOMContentLoaded', () => {
  new Drawer();
});
