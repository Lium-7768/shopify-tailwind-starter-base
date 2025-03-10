class CollectionView {
  constructor() {
    this.init();
  }

  init() {
    this.viewButtons = document.querySelectorAll('.view-button');
    this.priceLabels = document.querySelectorAll('.js-price-label');
    this.priceTexts = document.querySelectorAll('.js-price-text');
    
    this.bindEvents();
    
    // Set initial view based on session storage or default to grid
    const currentView = sessionStorage.getItem('collection-view-mode') || 'grid';
    this.setView(currentView);
  }

  bindEvents() {
    this.viewButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const view = e.currentTarget.dataset.view;
        this.setView(view);
      });
    });
  }

  setView(view) {
    
    // Update button states
    this.viewButtons.forEach(button => {
      if (button.dataset.view === view) {
        button.classList.remove('twcss-border-secondary-middle', 'twcss-text-secondary-middle');
        button.classList.add('twcss-border-secondary-default', 'twcss-text-secondary-default');
      } else {
        button.classList.remove('twcss-border-secondary-default', 'twcss-text-secondary-default');
        button.classList.add('twcss-border-secondary-middle', 'twcss-text-secondary-middle');
      }
    });

    // Update price label display
    this.priceTexts.forEach(text => {
      if (view === 'list') {
        text.style.display = 'inline';
      } else {
        text.style.display = 'block';
      }
    });
  }
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  new CollectionView();
}); 