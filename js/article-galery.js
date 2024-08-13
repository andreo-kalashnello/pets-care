

(function() {
    var swiper = new Swiper(".articleSwiper", {
      spaceBetween: 0,
      slidesPerView: 6,
      freeMode: true,
      watchSlidesProgress: true,
    });
  
    var swiper2 = new Swiper(".articleSwiper2", {
      spaceBetween: 10,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        type: "fraction",
      },
      thumbs: {
        swiper: swiper,
      },
    });
})();
