class Slider {
  constructor(selector, options = {}) {
    this.container = document.querySelector(selector);
    if (!this.container) return;

    const sliderContainer = this.container.closest('.twcss-relative');
    this.prevBtn = sliderContainer.querySelector('.prev-button');
    this.nextBtn = sliderContainer.querySelector('.next-button');

    this.wrapper = this.container.querySelector('.swiper-wrapper');
    this.slides = Array.from(this.container.querySelectorAll('.swiper-slide'));
    this.pagination = this.container.querySelector('.swiper-pagination');

    // 配置项
    this.options = {
      slidesPerView: 1.2,
      spaceBetween: 16,
      ...options,
    };

    // 状态变量
    this.currentIndex = 0;
    this.slideWidth = 0;
    this.isDragging = false;
    this.startPos = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;

    this.init();
  }

  init() {
    this.setupStyles();
    this.calculateSlideWidth();
    this.createPagination();
    this.bindEvents();
    this.updateSliderPosition();

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      this.calculateSlideWidth();
      this.updateSliderPosition();
    });
  }

  setupStyles() {
    this.container.style.overflow = 'hidden';
    this.wrapper.style.display = 'flex';
    this.wrapper.style.transition = 'transform 0.3s ease-out';

    this.slides.forEach((slide) => {
      slide.style.flex = `0 0 ${100 / this.getSlidesPerView()}%`;
      slide.style.padding = `0 ${this.options.spaceBetween / 2}px`;
    });
  }

  getSlidesPerView() {
    const width = window.innerWidth;
    if (width >= 1280) return 5;
    if (width >= 1024) return 4;
    if (width >= 768) return 3;
    if (width >= 640) return 2;
    return this.options.slidesPerView;
  }

  calculateSlideWidth() {
    const containerWidth = this.container.offsetWidth;
    this.slideWidth = containerWidth / this.getSlidesPerView();
  }

  createPagination() {
    if (!this.pagination) return;

    const pageCount = Math.ceil(this.slides.length / this.getSlidesPerView());
    this.pagination.innerHTML = '';

    for (let i = 0; i < pageCount; i++) {
      const dot = document.createElement('span');
      dot.classList.add('pagination-dot');
      dot.style.cssText = `
        display: inline-block;
        width: 8px;
        height: 8px;
        margin: 0 4px;
        border-radius: 50%;
        background-color: ${i === 0 ? '#3B82F6' : '#E5E7EB'};
        cursor: pointer;
      `;
      dot.addEventListener('click', () => this.goToPage(i));
      this.pagination.appendChild(dot);
    }
  }

  bindEvents() {
    // 触摸事件
    this.wrapper.addEventListener('touchstart', this.touchStart.bind(this));
    this.wrapper.addEventListener('touchmove', this.touchMove.bind(this));
    this.wrapper.addEventListener('touchend', this.touchEnd.bind(this));

    // 鼠标事件
    this.wrapper.addEventListener('mousedown', this.touchStart.bind(this));
    this.wrapper.addEventListener('mousemove', this.touchMove.bind(this));
    this.wrapper.addEventListener('mouseup', this.touchEnd.bind(this));
    this.wrapper.addEventListener('mouseleave', this.touchEnd.bind(this));

    // 导航按钮
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.slide('prev'));
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.slide('next'));
    }
  }

  touchStart(e) {
    this.isDragging = true;
    this.startPos = this.getPositionX(e);
    this.wrapper.style.transition = 'none';
  }

  touchMove(e) {
    if (!this.isDragging) return;

    const currentPosition = this.getPositionX(e);
    const diff = currentPosition - this.startPos;
    this.currentTranslate = this.prevTranslate + diff;

    this.setSliderPosition(this.currentTranslate);
  }

  touchEnd() {
    this.isDragging = false;
    this.wrapper.style.transition = 'transform 0.3s ease-out';

    const movedBy = this.currentTranslate - this.prevTranslate;

    if (Math.abs(movedBy) > this.slideWidth / 3) {
      if (movedBy < 0) {
        this.slide('next');
      } else {
        this.slide('prev');
      }
    } else {
      this.updateSliderPosition();
    }
  }

  getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  }

  slide(direction) {
    if (direction === 'next') {
      this.currentIndex = Math.min(
        this.currentIndex + 1,
        this.slides.length - this.getSlidesPerView(),
      );
    } else {
      this.currentIndex = Math.max(this.currentIndex - 1, 0);
    }

    this.updateSliderPosition();
    this.updatePagination();
  }

  goToPage(pageIndex) {
    this.currentIndex = pageIndex * this.getSlidesPerView();
    this.updateSliderPosition();
    this.updatePagination();
  }

  updateSliderPosition() {
    this.currentTranslate = -this.currentIndex * this.slideWidth;
    this.prevTranslate = this.currentTranslate;
    this.setSliderPosition(this.currentTranslate);
  }

  setSliderPosition(position) {
    this.wrapper.style.transform = `translateX(${position}px)`;
  }

  updatePagination() {
    if (!this.pagination) return;

    const dots = this.pagination.querySelectorAll('.pagination-dot');
    const currentPage = Math.floor(this.currentIndex / this.getSlidesPerView());

    dots.forEach((dot, index) => {
      dot.style.backgroundColor = index === currentPage ? '#3B82F6' : '#E5E7EB';
    });
  }
}

// 初始化滑块
document.addEventListener('DOMContentLoaded', () => {
  new Slider('.featured-products-slider', {
    slidesPerView: 1.2,
    spaceBetween: 16,
  });
});
