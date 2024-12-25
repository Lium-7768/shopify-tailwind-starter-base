class ProductCompare {
  constructor() {
    this.compareBar = document.getElementById('compare-bar');
    this.compareProducts = document.getElementById('compare-products');
    this.compareButton = document.getElementById('compare-button');
    this.compareCount = document.getElementById('compare-count');
    this.clearButton = document.getElementById('compare-clear');
    this.maxProducts = 4;
    this.selectedProducts = new Map();

    this.init();
  }

  init() {
    this.initCheckboxes();
    this.initClearButton();
    this.initCompareButton();
    this.loadSavedProducts();
  }

  initCheckboxes() {
    document.addEventListener('change', (e) => {
      if (e.target.matches('.compare-checkbox')) {
        if (e.target.checked) {
          this.addProduct(e.target);
        } else {
          this.removeProduct(e.target.value);
        }
      }
    });
  }

  addProduct(checkbox) {
    if (this.selectedProducts.size >= this.maxProducts) {
      checkbox.checked = false;
      // Show error message (implement your own notification system)
      alert(`You can only compare up to ${this.maxProducts} products`);
      return;
    }

    const productData = {
      id: checkbox.value,
      title: checkbox.dataset.productTitle,
      image: checkbox.dataset.productImage,
      url: checkbox.dataset.productUrl,
    };

    this.selectedProducts.set(productData.id, productData);
    this.updateCompareBar();
    this.saveProducts();
  }

  removeProduct(productId) {
    this.selectedProducts.delete(productId);
    this.updateCompareBar();
    this.saveProducts();

    // Uncheck the corresponding checkbox
    const checkbox = document.querySelector(
      `.compare-checkbox[value="${productId}"]`,
    );
    if (checkbox) checkbox.checked = false;
  }

  updateCompareBar() {
    this.compareProducts.innerHTML = '';
    const template = document.getElementById('compare-product-template');

    this.selectedProducts.forEach((product) => {
      const clone = template.content.cloneNode(true);

      const img = clone.querySelector('img');
      img.src = product.image;
      img.alt = product.title;

      clone.querySelector('span').textContent = product.title;

      const removeButton = clone.querySelector('.remove-compare');
      removeButton.addEventListener('click', () =>
        this.removeProduct(product.id),
      );

      this.compareProducts.appendChild(clone);
    });

    this.compareCount.textContent = this.selectedProducts.size;
    this.compareButton.disabled = this.selectedProducts.size < 2;

    if (this.selectedProducts.size > 0) {
      this.compareBar.classList.remove('twcss-translate-y-full');
    } else {
      this.compareBar.classList.add('twcss-translate-y-full');
    }
  }

  initClearButton() {
    this.clearButton.addEventListener('click', () => {
      this.selectedProducts.clear();
      this.updateCompareBar();
      this.saveProducts();

      // Uncheck all checkboxes
      document.querySelectorAll('.compare-checkbox').forEach((checkbox) => {
        checkbox.checked = false;
      });
    });
  }

  initCompareButton() {
    this.compareButton.addEventListener('click', () => {
      const ids = Array.from(this.selectedProducts.keys());
      window.location.href = `/pages/compare?products=${ids.join(',')}`;
    });
  }

  saveProducts() {
    localStorage.setItem(
      'compareProducts',
      JSON.stringify(Array.from(this.selectedProducts.entries())),
    );
  }

  loadSavedProducts() {
    const saved = localStorage.getItem('compareProducts');
    if (saved) {
      this.selectedProducts = new Map(JSON.parse(saved));
      this.updateCompareBar();

      // Check corresponding checkboxes
      this.selectedProducts.forEach((_, id) => {
        const checkbox = document.querySelector(
          `.compare-checkbox[value="${id}"]`,
        );
        if (checkbox) checkbox.checked = true;
      });
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ProductCompare();
});
