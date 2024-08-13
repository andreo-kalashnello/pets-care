const swiper = new Swiper(".doctornear-swiper", {
    slidesPerView: 3,
    slidesPerGroup: 3,
    spaceBetween: 35,
    loop: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    breakpoints: {
        1600: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 35,
        },
        830: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            spaceBetween: 20,
        },
        320: {
            slidesPerView: 1,
            slidesPerGroup: 1,
            spaceBetween: 20,
        },
    },
    on: {
        slideChangeTransitionStart: function () {
            // Получаем текущий активный слайд
            const activeSlide = this.slides[this.activeIndex];

            // Получаем индекс текущего слайда
            const targetId = activeSlide.getAttribute('data-target');

            // Получаем индексы первого и последнего видимого слайда
            const firstVisibleIndex = this.activeIndex;
            const lastVisibleIndex = this.activeIndex + this.params.slidesPerView - 1;

            // Проходимся по всем слайдам в слайдере
            for (let i = 0; i < this.slides.length; i++) {
                const slide = this.slides[i];

                // Проверяем, виден ли слайд
                if (i >= firstVisibleIndex && i <= lastVisibleIndex) {
                    // Если слайд виден, добавляем box-shadow
                    slide.classList.add('visible-slide');
                } else {
                    // Если слайд не виден, убираем box-shadow
                    slide.classList.remove('visible-slide');
                }
            }
            // Убираем класс активности со всех кнопок dropdown
            const allButtons = document.querySelectorAll('.catalog__card-adress-p-drop');
            allButtons.forEach(btn => {
                if (btn.getAttribute('data-target') !== targetId) {
                    btn.classList.remove('active');
                }
            });

            // Убираем класс активности со всех блоков dropdownContent
            const allDropdownContents = document.querySelectorAll('.catalog__card-left-bottom');
            allDropdownContents.forEach(content => {
                if (content.id !== targetId) {
                    content.classList.remove('active');
                }
            });
        },
    },
});


const dropdownButtons = document.querySelectorAll('.catalog__card-adress-p-drop');
dropdownButtons.forEach(button => {
    button.addEventListener('click', toggleDropdown);
});

function toggleDropdown(event) {
    const button = event.currentTarget;
    const targetId = button.getAttribute('data-target');
    const dropdownContent = document.getElementById(targetId);
    
    button.classList.toggle('active');
    dropdownContent.classList.toggle('active');
}



// doctor-review

