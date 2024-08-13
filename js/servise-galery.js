Fancybox.bind('[data-fancybox="gallery"]', {
    dragToClose: false,

    Toolbar: {
        display: {
        left: ['close'],
        middle: [],
        right: [],
        },
    },

    Images: {
        zoom: false,
    },

    Thumbs: {
        type: 'classic',
    },

    Carousel: {
        transition: false,
        friction: 0,
    },

    on: {
        'Carousel.ready Carousel.change': (fancybox) => {
        fancybox.container.style.setProperty(
            '--bg-image',
            `url("${fancybox.getSlide().thumbSrc}")`
        );
        },
    },
});
