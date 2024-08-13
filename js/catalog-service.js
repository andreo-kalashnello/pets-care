




document.addEventListener('DOMContentLoaded', function () {

// Добавляем обработчик события скролла
window.addEventListener('scroll', handleScroll);



// Получаем элементы меню и окна браузера
const menu = document.querySelector('.catalog__nav');
const menuOffset = menu.offsetTop;

// Функция, которая будет вызываться при скролле
function handleScroll() {
if (window.pageYOffset > menuOffset) {
    // Если прокрутка больше, чем offset меню, добавляем класс для фиксации
    menu.classList.add('fixed-menu');
} else {
    // В противном случае убираем класс
    menu.classList.remove('fixed-menu');
}
}


    window.addEventListener('scroll', handleScroll);

    const loadMoreLink = document.querySelector('.catalog__cards-more');
    loadMoreLink.addEventListener('click', function (event) {
        event.preventDefault();
        if (!this.disabled) {
            loadMoreCards();
        }
    });

    

    let displayedCardsCount = 0;
    let loadedCardsCount = 0;
    let sortingDirections = {
        'catalog__main-sorting-rate': 'to-less',
        'catalog__main-sorting-price': 'to-less',
        'catalog__main-sorting-branches': 'to-less',
        'catalog__main-sorting-reviews': 'to-less',
    };

    let filteredDoctors = [...serviseData];
    const cardsPerPage = 10;
    const container = document.getElementById('doctorCardsContainer');
    const alreadyLoadedCountSpan = document.querySelector('.catalog__card-already');
    const totalCardsCountSpan = document.querySelector('.catalog__card-all');
    const buttons = document.querySelectorAll('.catalog__main-sorting-btn');

    
    

function getDisplayStyle(value) {
return value ? 'block' : 'none';
}

function clearContainer() {
container.innerHTML = '';
}

function renderVisibleDoctors() {
    clearContainer();
    const visibleDoctors = filteredDoctors.slice(0, loadedCardsCount);
    visibleDoctors.forEach(doctor => {
        renderDoctor(doctor);
    });
}

function renderDoctor(doctor) {
const cardDiv = document.createElement('div');
cardDiv.classList.add('catalog__card', 'd-flex', 'flex-column', 'flex-md-row', 'justify-content-between', 'flex-wrap', );

cardDiv.innerHTML = `
<div class="catalog__card-left">
    <div class="catalog__card-left-top d-flex">
    <a class="catalog__card-ava" href="${doctor.cardPageHref}">
        <img class="catalog__card-ava-img" src="${doctor.image}" alt="">
        <p class="catalog__card-ava-info d-flex justify-content-between">
        ${doctor.premium ? `<span class="catalog__card-premium" style="display: ${getDisplayStyle(doctor.premium)}">Premium</span>` : ''}
        <span class="catalog__card-rate">${doctor.rate}</span>
        </p>
    </a>
    <div class="catalog__card-info d-flex flex-column">
        <h4 class="text__title-sm catalog__card-name">${doctor.name}</h4>
        <div class="catalog__card-prof">${doctor.prof}</div>
        <p class="d-flex">
        <span class="catalog__card-branches me-4">${doctor.branches}</span>
        <span class="catalog__card-reviews">${doctor.reviews}</span>
        </p>
        <p class="catalog__card-moreinfo d-flex">
        <span class="catalog__card-departure me-2 me-md-4" style="display: ${getDisplayStyle(doctor.departure)}">Виїзд додому</span>
        <span class="catalog__card-employee" style="display: ${getDisplayStyle(doctor.employee)}">Співробітник компанії</span>
        </p>
        <div class="catalog__card-pets d-flex">
        <div class="catalog__card-pet-dog" style="display: ${getDisplayStyle(doctor.petDog)}"></div>
        <div class="catalog__card-pet-cat" style="display: ${getDisplayStyle(doctor.petCat)}"></div>
        <div class="catalog__card-pet-parrot" style="display: ${getDisplayStyle(doctor.petParrot)}"></div>
        <div class="catalog__card-pet-mouse" style="display: ${getDisplayStyle(doctor.petMouse)}"></div>
        <div class="catalog__card-pet-turtle" style="display: ${getDisplayStyle(doctor.petTurtle)}"></div>
        <div class="catalog__card-pet-fish" style="display: ${getDisplayStyle(doctor.petFish)}"></div>
        <button class="catalog__card-adress-p-drop" data-target="address${doctor.id}">
            <img src="/img/dropdown-btn.svg" alt="">
        </button>
        </div>
        <button class="catalog__card-favorite">
        <img src="/img/catalog_card-favorite.svg" alt="">
        </button>
    </div>
    </div>
</div>
<div class="catalog__card-right d-flex flex-wrap align-content-start justify-content-between">
    <a href="#" class="catalog__card-firstconsult d-flex">
    <span>Первинна консультація</span>
    <span class="catalog__card-firstconsult-price">${doctor.firstConsultPrice}</span>
    </a>
    <a href="${doctor.chatHref}" class="catalog__card-chat">
    <img src="/img/catalog__card-chat.svg" alt="">
    </a>
    <button class="catalog__card-appointment" data-bs-toggle="modal" data-bs-target="#staticBackdrop${doctor.id}">
      Записатися на прийом
    </button>


    <!-- Modal -->
    <div class="modal fade success__modal" id="staticBackdrop${doctor.id}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdrop${doctor.id}Label" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdrop${doctor.id}Label">Modal title</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
          ${doctor.tel}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn cansel" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    
    <p class="catalog__card-bonuses">
    <span>Бонусів за прийом:</span>
    <span class="catalog__card-bonuse">${doctor.bonuse}</span>
    </p>
</div>
<div class="catalog__card-left-bottom catalog__card-adress" id=""address${doctor.id}>
    <a class="catalog__card-adress-route-link" href="#">
        <img class="catalog__card-adress-route" src="/img/catalog-card-route.svg" alt="">
    </a>
    <h5 class="catalog__card-adress-title">${doctor.placeTitle}</h5>
    <p class="catalog__card-adress-p d-flex">
        <span class="catalog__card-area">${doctor.area}</span>
        <span class="catalog__card-metro">${doctor.metro}</span>
        <span class="catalog__card-place">${doctor.place}</span>
    </p>
    </div>
</div>
`;

container.appendChild(cardDiv);
}


function loadMoreCards() {
    const remainingCards = filteredDoctors.slice(loadedCardsCount, loadedCardsCount + cardsPerPage);
    remainingCards.forEach(doctor => {
        renderDoctor(doctor);
        loadedCardsCount++;
    });
    alreadyLoadedCountSpan.textContent = loadedCardsCount;
    totalCardsCountSpan.textContent = filteredDoctors.length;
    if (loadedCardsCount >= filteredDoctors.length) {
        loadMoreLink.disabled = true;
        loadMoreLink.textContent = 'All cards loaded';
    }
    const dropdownButtons = document.querySelectorAll('.catalog__card-adress-p-drop');
    dropdownButtons.forEach(button => {
    button.addEventListener('click', toggleDropdown)
    });
}





function sortBySelectedOption(buttonClass) {
    const sortingDirection = sortingDirections[buttonClass];
    const oppositeDirection = sortingDirection === 'to-less' ? 'to-more' : 'to-less';

    // Toggle the sorting class for the clicked button
    const clickedButton = document.querySelector(`.${buttonClass}`);
    clickedButton.classList.toggle(sortingDirection, true);
    clickedButton.classList.remove(oppositeDirection);
    clickedButton.classList.add('active');

    // Set the opposite sorting class for other buttons
    buttons.forEach(btn => {
        if (btn !== clickedButton) {
            btn.classList.remove(sortingDirection, 'active');
            btn.classList.add(oppositeDirection);
        }
    });

    if (buttonClass === 'catalog__main-sorting-rate') {
        sortingDirections[buttonClass] = sortingDirection === 'to-less' ? 'to-more' : 'to-less';
        filteredDoctors.sort((a, b) => sortingDirection === 'to-less' ? b.rate - a.rate : a.rate - b.rate);
    } else if (buttonClass === 'catalog__main-sorting-price') {
        sortingDirections[buttonClass] = sortingDirection === 'to-less' ? 'to-more' : 'to-less';
        filteredDoctors.sort((a, b) => sortingDirection === 'to-less' ? b.firstConsultPrice - a.firstConsultPrice : a.firstConsultPrice - b.firstConsultPrice);
    } else if (buttonClass === 'catalog__main-sorting-branches') {
        sortingDirections[buttonClass] = sortingDirection === 'to-less' ? 'to-more' : 'to-less';
        filteredDoctors.sort((a, b) => sortingDirection === 'to-less' ? b.branches - a.branches : a.branches - b.branches);
    } else if (buttonClass === 'catalog__main-sorting-reviews') {
        sortingDirections[buttonClass] = sortingDirection === 'to-less' ? 'to-more' : 'to-less';
        filteredDoctors.sort((a, b) => sortingDirection === 'to-less' ? b.reviews - a.reviews : a.reviews - b.reviews);
    }
}

    function setActiveSortingButton(button) {
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    }

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const buttonClass = this.classList[1];
            sortBySelectedOption(buttonClass);
            setActiveSortingButton(this);
            loadedCardsCount = 0; // Reset loaded cards count when sorting changes
            renderVisibleDoctors();
            loadMoreCards();
        });
    });

    const defaultSortingButton = document.querySelector('.catalog__main-sorting-rate');
sortBySelectedOption(defaultSortingButton.classList[1]);
    setActiveSortingButton(document.querySelector('.catalog__main-sorting-rate'));
    renderVisibleDoctors();
    loadMoreCards();

    // Добавьте следующий обработчик события к каждой кнопке
const dropdownButtons = document.querySelectorAll('.catalog__card-adress-p-drop');
dropdownButtons.forEach(button => {
    button.addEventListener('click', toggleDropdown)
});

function toggleDropdown(event) {
    const button = event.currentTarget;
    const card = button.closest('.catalog__card');
    const dropdownContent = card.querySelector('.catalog__card-left-bottom');

    button.classList.toggle('active');
    dropdownContent.classList.toggle('active');
}
});


console.log(serviseData);

