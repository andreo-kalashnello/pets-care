

// dropdown рубрикатор news

(function() {
    const categoryMenuDrop = document.querySelector('.categories__menu-dropdown');
    const categoryNewsWrap = document.querySelector('.news__categories-wrap-mb');

    categoryMenuDrop.addEventListener('click', () => {
        categoryNewsWrap.classList.toggle('active');
        categoryMenuDrop.classList.toggle('active');
    });
})();