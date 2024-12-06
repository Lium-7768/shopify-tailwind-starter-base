function initSwiper(selector, options) {
  document.addEventListener('DOMContentLoaded', function() {
    const swipers = document.querySelectorAll(selector);
    swipers.forEach((swiperElement, index) => {
      const uniqueClass = `${selector.replace('.', '')}-${index}`;
      swiperElement.classList.add(uniqueClass);

      const paginationElement = swiperElement.querySelector('.swiper-pagination');
      const nextButton = swiperElement.querySelector('.swiper-button-next');
      const prevButton = swiperElement.querySelector('.swiper-button-prev');

      if (paginationElement) paginationElement.classList.add(`${uniqueClass}-pagination`);
      if (nextButton) nextButton.classList.add(`${uniqueClass}-next`);
      if (prevButton) prevButton.classList.add(`${uniqueClass}-prev`);

      const swiperOptions = {
        ...options,
        pagination: paginationElement ? {
          el: `.${uniqueClass}-pagination`,
          clickable: true,
        } : false,
        navigation: (nextButton && prevButton) ? {
          nextEl: `.${uniqueClass}-next`,
          prevEl: `.${uniqueClass}-prev`,
        } : false,
      };

      new Swiper(`.${uniqueClass}`, swiperOptions);
    });
  });
}