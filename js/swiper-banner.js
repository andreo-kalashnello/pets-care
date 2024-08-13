(function() {
    const swiper = new Swiper(".bannerNavmoreSwiper", {
        spaceBetween: 30,
    centeredSlides: true,
    loop: true,
    autoplay: {
        // скорость прокрутки
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    });
})();

