
function initTabs(tabContainer) {
    if (!tabContainer) return; // Check if the container exists

    const tabsItem = tabContainer.querySelectorAll('.tabs__btn-item');
    const tabContents = tabContainer.querySelectorAll('.tabs__content-item');

    tabsItem.forEach(tabItem => {
        tabItem.addEventListener('click', open);
    });

    function open(event) {
        const tabTarget = event.currentTarget;
        const button = tabTarget.dataset.button;

        tabsItem.forEach(tabItem => {
            tabItem.classList.remove('tabs__btn-item--active');
        });
        tabTarget.classList.add('tabs__btn-item--active');

        tabContents.forEach(tabContent => {
            tabContent.classList.remove('tabs__content-item--active');
        });

        document.querySelector(`#${button}`).classList.add('tabs__content-item--active');
    }
}

// Find and initialize tabs for all sections with class ".tabs"
document.querySelectorAll('.tabs').forEach(tabContainer => {
    initTabs(tabContainer);
});
