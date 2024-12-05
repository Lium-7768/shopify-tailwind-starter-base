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
    // 先移除隐藏类
    this.drawer.classList.remove(
      'twcss-invisible',
      'twcss-opacity-0',
      'twcss-pointer-events-none',
    );

    // 等待下一帧再执行动画
    requestAnimationFrame(() => {
      this.drawer.classList.add(
        'twcss-visible',
        'twcss-opacity-100',
        'twcss-pointer-events-auto',
      );
      this.backdrop.classList.remove('twcss-opacity-0');
      this.content.classList.remove('twcss-translate-x-[-100%]');
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
    this.backdrop.classList.add('twcss-opacity-0');
    this.content.classList.add('twcss-translate-x-[-100%]');

    // 等待动画完成后再隐藏
    setTimeout(() => {
      this.drawer.classList.add(
        'twcss-invisible',
        'twcss-opacity-0',
        'twcss-pointer-events-none',
      );
      this.drawer.classList.remove(
        'twcss-visible',
        'twcss-opacity-100',
        'twcss-pointer-events-auto',
      );
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
