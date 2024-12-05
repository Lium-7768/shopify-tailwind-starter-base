class Slider {
  constructor(selector, options = {}) {
    this.container = document.querySelector(selector);
    if (!this.container) return;

    this.wrapper = this.container.querySelector('.swiper-wrapper');
    this.slides = Array.from(this.container.querySelectorAll('.swiper-slide'));
    this.pagination = this.container.querySelector('.swiper-pagination');
    this.prevBtn = this.container.parentElement.querySelector('.prev-button');
    this.nextBtn = this.container.parentElement.querySelector('.next-button');

    // 配置项
    this.options = {
      slidesPerView: 1,
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
      this.createPagination();
      this.updateSliderPosition();
      this.updatePagination();
    });
  }

  setupStyles() {
    this.container.style.overflow = 'hidden';
    this.wrapper.style.display = 'flex';
    this.wrapper.style.transition = 'transform 0.3s ease-out';
    this.wrapper.style.gap = `${this.options.spaceBetween}px`;

    this.slides.forEach((slide) => {
      const slidesPerView = this.getSlidesPerView();
      if (slidesPerView === 1) {
        slide.style.flex = '0 0 100%';
      } else {
        slide.style.flex = `0 0 calc((100% - ${
          this.options.spaceBetween * (slidesPerView - 1)
        }px) / ${slidesPerView})`;
      }
      slide.style.padding = '0';
    });
  }

  getSlidesPerView() {
    const width = window.innerWidth;
    if (width >= 1280) return 5; // xl
    if (width >= 1024) return 4; // lg
    if (width >= 768) return 3; // md
    return 1; // 移动端
  }

  calculateSlideWidth() {
    const containerWidth = this.container.offsetWidth;
    const slidesPerView = this.getSlidesPerView();
    if (slidesPerView === 1) {
      this.slideWidth = containerWidth;
    } else {
      const totalGaps = this.options.spaceBetween * (slidesPerView - 1);
      this.slideWidth = (containerWidth - totalGaps) / slidesPerView;
    }
  }

  createPagination() {
    if (!this.pagination) return;

    const slidesPerView = this.getSlidesPerView();
    // 计算总页数：总slide数除以每页显示数（向上取整）
    const pageCount = Math.ceil(this.slides.length / slidesPerView);
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
        transition: background-color 0.3s ease;
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
      this.updatePagination();
    }
  }

  getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  }

  slide(direction) {
    const maxIndex = this.slides.length - this.getSlidesPerView();

    if (direction === 'next') {
      this.currentIndex = Math.min(this.currentIndex + 1, maxIndex);
    } else {
      this.currentIndex = Math.max(this.currentIndex - 1, 0);
    }

    this.updateSliderPosition();
    this.updatePagination();
  }

  goToPage(pageIndex) {
    const slidesPerView = this.getSlidesPerView();
    // 计算要滑动到的索引位置
    this.currentIndex = pageIndex * slidesPerView;

    // 确保不会滑过头
    const maxIndex = this.slides.length - slidesPerView;
    this.currentIndex = Math.min(this.currentIndex, maxIndex);

    this.updateSliderPosition();
    this.updatePagination();
  }

  updateSliderPosition() {
    const slidesPerView = this.getSlidesPerView();
    if (slidesPerView === 1) {
      // 移动端：完整滑动一个slide的宽度
      this.currentTranslate =
        -this.currentIndex * (this.slideWidth + this.options.spaceBetween);
    } else {
      // PC端：滑动一个slide的宽度
      this.currentTranslate = -this.currentIndex * this.slideWidth;
    }
    this.prevTranslate = this.currentTranslate;
    this.setSliderPosition(this.currentTranslate);
    this.updatePagination();
  }

  setSliderPosition(position) {
    this.wrapper.style.transform = `translateX(${position}px)`;
  }

  updatePagination() {
    if (!this.pagination) return;

    const dots = this.pagination.querySelectorAll('.pagination-dot');
    const slidesPerView = this.getSlidesPerView();
    // 计算当前页码
    const currentPage = Math.floor(this.currentIndex / slidesPerView);

    dots.forEach((dot, index) => {
      dot.style.backgroundColor =
        index === currentPage ? '#3B82F6 !important' : '#E5E7EB !important';
    });
  }
}

// 初始化滑块
document.addEventListener('DOMContentLoaded', () => {
  new Slider('.featured-products-slider', {
    slidesPerView: 5,
    spaceBetween: 16,
  });
});
