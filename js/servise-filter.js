

// Добавляем обработчик события скролла
window.addEventListener('scroll', handleScroll);

let cardsPerPage = 10;
const departureCheckbox = document.getElementById('departureCheckbox');
const departureCheckboxWrap = document.querySelector('.catalog__doctor-checkbox-wrapper');
departureCheckbox.addEventListener('click', () => {
departureCheckboxWrap.classList.toggle('active')
})

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

document.addEventListener('DOMContentLoaded', function () {

const loadMoreLink = document.querySelector('.catalog__cards-more');
loadMoreLink.addEventListener('click', function (event) {
    event.preventDefault();
    if (!this.disabled) {
    loadMoreCards();
    }
});


// Добавляем обработчик события для чекбокса "Выезд на дом"
document.getElementById('departureCheckbox').addEventListener('change', function () {
    handleDepartureCheckboxChange();
});

loadMoreCards();

    // Добавьте следующий обработчик события к каждой кнопке
    const dropdownButtons = document.querySelectorAll('.catalog__card-adress-p-drop');
    dropdownButtons.forEach(button => {
    button.addEventListener('click', toggleDropdown)
    });
});



function handleDepartureCheckboxChange() {
updateDepartureFilter();
loadMoreCards();
}




let loadedCardsCount = 0;
let displayedCardsCount = 0;
const container = document.getElementById('doctorCardsContainer');
const buttons = document.querySelectorAll('.catalog__main-sorting-btn');




function getDisplayStyle(value) {
return value ? 'block' : 'none';
}

function clearContainer() {
container.innerHTML = '';
}


function toggleDropdown(event) {
const button = event.currentTarget;
const card = button.closest('.catalog__card');
const dropdownContent = card.querySelector('.catalog__card-left-bottom');

button.classList.toggle('active');
dropdownContent.classList.toggle('active');
}




function renderVisibleDoctors() {
clearContainer();

const visibleDoctors = filteredDoctors.slice(0, loadedCardsCount);

visibleDoctors.forEach(doctor => {
    renderDoctor(doctor);
});
}

function renderDoctors(doctors, append = false) {
const container = document.getElementById('doctorCardsContainer');

if (!append) {
    container.innerHTML = '';
    displayedCardsCount = 0;
}

doctors.slice(displayedCardsCount).forEach(doctor => {
    renderDoctor(doctor);
    displayedCardsCount++;
});


updateLoadMoreLinkState(filteredDoctors);
}

let selectedArea = '';
let selectedProfession = '';
let filteredDoctors = [...doctorsData];
let selectedMetroStations = []; 


// Функция для создания чекбокса метро
function createMetroCheckbox(station, branch, color) {
const metroList = document.getElementById(`${branch}MetroOptions`);

// Проверяем, есть ли уже чекбокс с такой станцией
const existingCheckbox = metroList.querySelector(`input[value="${station}"]`);

// Проверяем, что `metro` не является пустой строкой
if (!existingCheckbox && station.trim() !== '') {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = station;

    const label = document.createElement('label');
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(station));

    const listItem = document.createElement('li');
    listItem.classList.add(`metro__${branch}`, `metro__list-item`);
    listItem.appendChild(label);

    metroList.appendChild(listItem);
}
}

// Создайте чекбоксы для каждой станции метро в соответствующих ветках
doctorsData.forEach(doctor => {
createMetroCheckbox(doctor.metro, doctor.branch, doctor.branch === 'red' ? 'red' : (doctor.branch === 'blue' ? 'blue' : 'green'));
});

// Добавьте обработчики событий для чекбоксов метро
const allMetroCheckboxes = document.querySelectorAll('.metro__filter input[type="checkbox"]');
allMetroCheckboxes.forEach(checkbox => {
checkbox.addEventListener('change', updateMetroFilter);
});

// Обновленная функция для обработки изменения чекбоксов метро
function updateMetroFilter() {
selectedMetroStations = Array.from(allMetroCheckboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);

applyFilters();  // Обновляем все фильтры
loadMoreCards();
}


// Обновленная функция для фильтрации по метро
function applyMetroFilter(doctors) {
return doctors.filter(doctor => {
    if (selectedMetroStations.length === 0) {
    return true;  // Если ни одна станция метро не выбрана, возвращаем true для всех врачей
    }

    return selectedMetroStations.includes(doctor.metro);
});
}

function loadMoreCards() {

filteredDoctors = filteredDoctors;

// Получаем выбранный район и специальность
const newSelectedArea = document.getElementById('areaInput').value.trim();
const newSelectedProfession = document.getElementById('profInput').value.trim();

// Обновляем фильтры только если они изменились
if (selectedProfession !== newSelectedProfession || selectedArea !== newSelectedArea) {
    selectedProfession = newSelectedProfession;
    selectedArea = newSelectedArea;
    applyFilters();
}


// Примените фильтр по метро перед отображением врачей
applyMetroFilter(selectedMetroStations);

updateDepartureFilter();

const remainingCards = filteredDoctors.length - loadedCardsCount;
const cardsToLoad = Math.min(10, remainingCards);

console.log(filteredDoctors);
loadedCardsCount += cardsToLoad;
renderVisibleDoctors();
updateLoadMoreLinkState(filteredDoctors);

const dropdownButtons = document.querySelectorAll('.catalog__card-adress-p-drop');
    dropdownButtons.forEach(button => {
    button.addEventListener('click', toggleDropdown)
    });
}

function applyFilters() {
const filteredByProfession = selectedProfession
    ? filterDoctorsByProfession(selectedProfession, doctorsData)
    : [...doctorsData];

const filteredByArea = selectedArea
    ? filterDoctorsByArea(selectedArea, filteredByProfession) // Используем filteredByProfession вместо doctorsData
    : filteredByProfession;


filteredDoctors = filteredByArea;

// Применяем фильтр по метро
filteredDoctors = applyMetroFilter(filteredDoctors);
document.getElementById('departureCheckbox').checked = false;
document.querySelector('.catalog__doctor-checkbox-wrapper').classList.remove('active');
}




function filterDoctorsByArea(selectedArea, doctors) {
return doctors.filter(doctor => doctor.area === selectedArea);
}

function filterDoctorsByProfession(selectedProfession, doctors) {
return doctors.filter(doctor => doctor.prof === selectedProfession);
}

function filterDoctorsByDeparture(doctors) {
return doctors.filter(doctor => doctor.departure);
}

function updateDepartureFilter() {
const departureCheckbox = document.getElementById('departureCheckbox');

const isDepartureEnabled = departureCheckbox.checked;

if (isDepartureEnabled) {
    filteredDoctors = filterDoctorsByDeparture(filteredDoctors);
} else {
    applyFilters();
}
}



function sortByRating() {
doctorsData.sort((a, b) => sortingDirections['catalog__main-sorting-rate'] === 'to-less' ? b.rate - a.rate : a.rate - b.rate);
}

function sortByPrice() {
doctorsData.sort((a, b) => sortingDirections['catalog__main-sorting-price'] === 'to-less' ? b.firstConsultPrice - a.firstConsultPrice : a.firstConsultPrice - b.firstConsultPrice);
}

function sortByBranches() {
doctorsData.sort((a, b) => sortingDirections['catalog__main-sorting-branches'] === 'to-less' ? b.branches - a.branches : a.branches - b.branches);
}

function sortByReviews() {
doctorsData.sort((a, b) => sortingDirections['catalog__main-sorting-reviews'] === 'to-less' ? b.reviews - a.reviews : a.reviews - b.reviews);
}

function sortBySelectedOption(buttonClass) {
if (buttonClass === 'catalog__main-sorting-rate') {
    sortByRating();
} else if (buttonClass === 'catalog__main-sorting-price') {
    sortByPrice();
} else if (buttonClass === 'catalog__main-sorting-branches') {
    sortByBranches();
} else if (buttonClass === 'catalog__main-sorting-reviews') {
    sortByReviews();
}
}


function updateLoadMoreLinkState(filteredDoctors) {
const loadMoreLink = document.getElementById('loadMoreLink');

if (loadedCardsCount >= filteredDoctors.length) {
    loadMoreLink.disabled = true;
    loadMoreLink.textContent = 'All cards loaded';
} else {
    loadMoreLink.disabled = false;
    loadMoreLink.textContent = `Load more (${loadedCardsCount} of ${filteredDoctors.length})`;
}

}
let sortingDirections = {};

function activateButton(button) {
buttons.forEach(btn => btn.classList.remove('active', 'to-more', 'to-less'));
button.classList.add('active');

loadedCardsCount = 0;

const buttonClass = button.classList[1];
sortingDirections[buttonClass] = sortingDirections[buttonClass] === 'to-more' ? 'to-less' : 'to-more';

sortBySelectedOption(buttonClass);

button.classList.add(sortingDirections[buttonClass]);

loadMoreCards();
}

buttons.forEach(button => {
sortingDirections[button.classList[1]] = 'to-more';
button.addEventListener('click', () => {
    activateButton(button);
});
});

const loadMoreLink = document.querySelector('.catalog__cards-more');
loadMoreLink.addEventListener('click', function (event) {
event.preventDefault();
if (!this.disabled) {
    loadMoreCards();
}
});


const areaInput = document.getElementById('areaInput');
const areaDropdownOptions = document.getElementById('areaDropdownOptions');
const profInput = document.getElementById('profInput');
const profDropdownOptions = document.getElementById('profDropdownOptions');


// Extract unique areas and professions
const uniqueAreas = Array.from(new Set(doctorsData.map(doctor => doctor.area)));
const uniqueProfessions = Array.from(new Set(doctorsData.map(doctor => doctor.prof)));

// Sort areas and professions alphabetically
uniqueAreas.sort();
uniqueProfessions.sort();

let isTyping = false;

function addInputEvent(input, dropdownOptions, options) {
input.addEventListener('input', function () {
    const filter = input.value.trim().toLowerCase();
    const filteredOptions = options.filter(option => option.toLowerCase().includes(filter));

    dropdownOptions.innerHTML = '';

    filteredOptions.forEach((option, index) => {
    const li = document.createElement('li');
    li.textContent = option;
    li.setAttribute('data-value', index + 1);
    li.addEventListener('click', function () {
        selectDropdownOption(this, dropdownOptions.id.replace('Options', ''));
    });

    dropdownOptions.appendChild(li);
    });

    
});
}

addInputEvent(areaInput, areaDropdownOptions, uniqueAreas);
addInputEvent(profInput, profDropdownOptions, uniqueProfessions);

// Generate options list for area
uniqueAreas.forEach((area, index) => {
const li = document.createElement('li');
li.textContent = area;
li.setAttribute('data-value', index + 1);
li.addEventListener('click', function () {
    selectDropdownOption(this, areaDropdownOptions.id.replace('Options', ''));
});

areaDropdownOptions.appendChild(li);
});

// Generate options list for prof
uniqueProfessions.forEach((prof, index) => {
const li = document.createElement('li');
li.textContent = prof;
li.setAttribute('data-value', index + 1);
li.addEventListener('click', function () {
    selectDropdownOption(this, profDropdownOptions.id.replace('Options', ''));
});

profDropdownOptions.appendChild(li);
});

areaInput.addEventListener('click', function () {
toggleOptions('areaDropdownOptions');
});

profInput.addEventListener('click', function () {
toggleOptions('profDropdownOptions');
});

document.addEventListener('click', function (event) {
if (!areaInput.contains(event.target)) {
    areaDropdownOptions.classList.remove('show');
}
if (!profInput.contains(event.target)) {
    profDropdownOptions.classList.remove('show');
}
});

areaDropdownOptions.addEventListener('click', function (event) {
const selectedOption = event.target.textContent.trim();
areaInput.value = selectedOption;
toggleOptions('areaDropdownOptions');

// Обновляем значение переменной selectedArea
selectedArea = selectedOption;

// Очищаем и заново заполняем массив filteredDoctors
loadMoreCards();
});

profDropdownOptions.addEventListener('click', function (event) {
const selectedOption = event.target.textContent.trim();
profInput.value = selectedOption;
toggleOptions('profDropdownOptions');

// Обновляем значение переменной selectedProfession
selectedProfession = selectedOption;

// Очищаем и заново заполняем массив filteredDoctors
loadMoreCards();
});

function toggleOptions(optionsId) {
const optionsList = document.getElementById(optionsId);

if (optionsList) {
    optionsList.classList.toggle('show');
} else {
    console.error(`Element with ID '${optionsId}' not found.`);
}
}

function selectDropdownOption(option, dropdownId) {
const dropdown = document.getElementById(dropdownId);
const selectedInput = dropdown.querySelector('input');
if (selectedInput && selectedInput.tagName === 'INPUT') {
    selectedInput.value = option.textContent.trim();
    loadMoreCards();  // Добавляем вызов при выборе специализации или района
}

// Close the options list
toggleOptions(dropdownId + 'Options');
}


const resetFiltersButton = document.getElementById('resetFiltersButton');
resetFiltersButton.addEventListener('click', function () {
applyFilters()
// Сбрасываем значения всех фильтров
resetAllFilters();
// Перезагружаем карточки после сброса фильтров
loadMoreCards();

});


// Функция для сброса всех фильтров
function resetAllFilters() {
// Сбрасываем значения фильтров по метро
allMetroCheckboxes.forEach(checkbox => {
    checkbox.checked = false;
    const listItem = checkbox.closest('.metro__list-item');
    listItem.classList.remove('active');
});

// Остальной код сброса фильтров...
updateMetroFilter()


// Сбрасываем значения фильтров по району и специальности
areaInput.value = '';
profInput.value = '';

// Сбрасываем фильтр по выезду на дом
document.getElementById('departureCheckbox').checked = false;


}

allMetroCheckboxes.forEach(checkbox => {
checkbox.addEventListener('change', function () {
    // Добавляем/удаляем класс active при изменении состояния чекбокса
    const listItem = this.closest('.metro__list-item');
    listItem.classList.toggle('active', this.checked);
});
});


document.addEventListener('DOMContentLoaded', function () {
// Добавляем обработчики событий для табов
const redTab = document.getElementById('redTab');
const blueTab = document.getElementById('blueTab');
const greenTab = document.getElementById('greenTab');

redTab.addEventListener('click', function () {
    toggleTab('redTabWrap');
});

blueTab.addEventListener('click', function () {
    toggleTab('blueTabWrap');
});

greenTab.addEventListener('click', function () {
    toggleTab('greenTabWrap');
});

// Изначально скрываем все списки, кроме того, который активен
const activeTab = document.querySelector('.metro__list-wrap.active');
const inactiveTabs = document.querySelectorAll('.metro__list-wrap:not(.active)');

inactiveTabs.forEach(tab => {
    tab.classList.remove('active');
});
});

function toggleTab(tabId) {
// Помечаем активный таб
const allTabs = document.querySelectorAll('.metro__list-wrap');
allTabs.forEach(tab => {
    tab.classList.remove('active');
});

const activeTab = document.getElementById(tabId);
activeTab.classList.add('active');
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
