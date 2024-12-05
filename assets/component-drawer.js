class ComponentDrawer {
  constructor() {
    this.drawer = document.getElementById('products-drawer');
    if (!this.drawer) return;

    this.content = this.drawer.querySelector('[data-drawer-content]');
    this.backdrop = this.drawer.querySelector('[data-drawer-backdrop]');
    this.triggers = document.querySelectorAll(
      '[data-drawer-trigger="products"]',
    );
    this.closeButtons = document.querySelectorAll('[data-drawer-close]');

    this.isOpen = false;

    // 初始化时添加基础类，但保持隐藏状态
    requestAnimationFrame(() => {
      this.drawer.classList.add('twcss-initialized');
    });

    this.init();
  }

  init() {
    // 触发器事件监听
    this.triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => this.toggle());
    });

    // 关闭按钮事件监听
    this.closeButtons.forEach((button) => {
      button.addEventListener('click', () => this.close());
    });

    // 背景点击关闭
    this.backdrop.addEventListener('click', () => this.close());

    // ESC 键关闭
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
    this.drawer.classList.add('twcss-active');

    requestAnimationFrame(() => {
      this.backdrop.classList.remove('twcss-opacity-0');
      this.content.classList.remove('twcss-translate-x-[-100%]');
    });

    document.body.style.overflow = 'hidden';
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

    // 等待过渡动画完成后再完全隐藏
    setTimeout(() => {
      this.drawer.classList.remove('twcss-active');
      document.body.style.overflow = '';
    }, 300);

    this.drawer.setAttribute('aria-hidden', 'true');
    this.triggers.forEach((trigger) =>
      trigger.setAttribute('aria-expanded', 'false'),
    );
  }
}

// 确保 DOM 完全加载后再初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ComponentDrawer());
} else {
  new ComponentDrawer();
}
