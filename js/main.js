
// вход в аккаунт

  // Получить ссылку из кнопки "acc" при загрузке страницы
  let redirectUrl = document.getElementById('accButton').getAttribute('href');

  // Показать модальное окно 1
  document.getElementById('accButton').addEventListener('click', function(e) {
      e.preventDefault();
      document.getElementById('account__modal-Container').style.display = 'flex';
      document.getElementById('account__modal1').style.display = 'block';
      document.querySelector('body').classList.add('no-scroll');
  });

  // Закрыть модальное окно при клике на пустое место
  document.getElementById('account__modal-Container').addEventListener('click', function(e) {
      if (e.target === this) {
          closeModal('account__modal1');
          closeModal('account__modal2');
          document.querySelector('body').classList.remove('no-scroll');
      }
  });

  // Валидация номера телефона
  function validatePhoneNumber() {
    let phoneNumberInput = document.getElementById('phoneNumber');
    let phoneNumber = phoneNumberInput.value;
    let phoneRegex = /^\+\d{1,12}$/;

    let check1 = document.getElementById('check1');
    let check2 = document.getElementById('check2');

    // Проверяем, активены ли обе галочки
    let isCheck1Checked = check1.checked;
    let isCheck2Checked = check2.checked;

    if (phoneRegex.test(phoneNumber) && isCheck1Checked && isCheck2Checked) {
        // Валидация прошла успешно, удаляем стилизацию ошибки
        phoneNumberInput.classList.remove('is-invalid');
        
        // Переходим на второе модальное окно
        document.getElementById('account__modal1').style.display = 'none';
        document.getElementById('account__modal2').style.display = 'block';
    } else {
        // Номер телефона не валиден или не выбраны обе галочки, добавляем стилизацию ошибки
        phoneNumberInput.classList.add('is-invalid');
    }
}

  // Валидация кода SMS
  function validateSmsCode() {
    let smsCodeInput = document.getElementById('smsCode');
    let smsCode = smsCodeInput.value;
    let smsRegex = /^\d{1,10}$/;

      if (smsRegex.test(smsCode)) {
          // Валидация прошла успешно, переходим по ссылке
          window.location.href = redirectUrl;
      } else {
          // Код SMS не валиден, добавляем стилизацию ошибки
          smsCodeInput.classList.add('is-invalid');
      }
  }

  // Закрыть модальное окно
  function closeModal(modalId) {
      document.getElementById(modalId).style.display = 'none';
      document.getElementById('account__modal-Container').style.display = 'none';
      document.querySelector('body').classList.remove('no-scroll');
  }

  const closeBtns = document.querySelectorAll('.account__close-btn');
closeBtns.forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        closeModal('account__modal1');
        closeModal('account__modal2');
        document.querySelector('body').classList.remove('no-scroll');
        document.getElementById('account__modal-Container').style.display = 'none';
    });
});

// логика лупы
(function() {
    const searchBtn = document.querySelector('.header__middle-loup');
    const searchInput = document.querySelector('.header__middle-search-form');
    const closeSearchBtn = document.querySelector('.close-search');
    const nav = document.querySelector('.header__middle-nav');
    const onlineConsultBtn = document.querySelector('.header__middle-button');
    const dropdowns = document.querySelector('.header__dropdowns');

    searchBtn.addEventListener('click', function() {
        nav.classList.toggle('hidden');
        onlineConsultBtn.classList.toggle('hidden');
        dropdowns.classList.toggle('hidden');
        searchBtn.classList.toggle('hidden');
        searchInput.style.display = 'inline-block';
        closeSearchBtn.style.display = 'inline-block';


        setTimeout(function() {
            searchInput.classList.add('show');
        }, 100);
    });

    closeSearchBtn.addEventListener('click', function() {
        searchInput.style.display = 'none';
        closeSearchBtn.style.display = 'none';

        nav.classList.remove('hidden');
        onlineConsultBtn.classList.remove('hidden');
        dropdowns.classList.remove('hidden');
        searchBtn.classList.remove('hidden');
        
        searchInput.classList.remove('show');
    });
})();

// фиксирование при скролле
(function() {
    const headerMiddle = document.querySelector('.header__middle');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 30) {
            headerMiddle.classList.add('header__middle--fix');
        } else {
            headerMiddle.classList.remove('header__middle--fix');
        }
    });
})();

// бургер меню доп
(function() {
    const body = document.querySelector('body');
    const burgerBtn = document.querySelector('.burger__btn');
    const headerTop = document.querySelector('.header__top');
    const headerNavMore = document.querySelector('.header__navmore');
    const mainHeaderBtn = document.querySelector('.header__middle-button');
    const headerMiddle = document.querySelector('.header__middle');
    const headerDropDowns = document.querySelector('.header__dropdowns');
    const banner = document.querySelector('.navmore__banner');

    burgerBtn.addEventListener('click', () => {
        body.classList.toggle('no-scroll');
        headerTop.classList.toggle('header__top--hidden');
        headerNavMore.classList.toggle('header__navmore--active');
        burgerBtn.classList.toggle('burger__btn-close');
        mainHeaderBtn.classList.toggle('d-none');
        headerMiddle.classList.toggle('header__middle--fix');
        headerDropDowns.classList.toggle('header__dropdowns--active');
        banner.classList.add('navmore__banner--active')
    })

})();

// логика табов для доп меню


(function() {
  const navmoreContent = document.querySelector('.header__navmore-content');
  const tabs = document.querySelectorAll('.header__navmore-link');
  const contents = document.querySelectorAll('.navmore__content');
  const banner = document.querySelector('.navmore__banner');

  tabs.forEach(tab => {
    tab.addEventListener('mouseover', function() {
      const contentId = this.getAttribute('data-content');
      updateContent(contentId);
      banner.classList.remove('navmore__banner--active');
    });
    if (window.innerWidth <= 1600) {
      const firstContent = document.querySelector('#content1');
      firstContent.classList.add('d-block');
      firstContent.classList.remove('d-none');
    }
    if (window.innerWidth <= 600) {
      const firstContent = document.querySelector('#content1');
      firstContent.classList.remove('d-block');
      firstContent.classList.add('d-none');
    }

    tab.addEventListener('click', function(event) {
      if (window.innerWidth <= 1400) {
        event.preventDefault();
        const contentId = this.getAttribute('data-content');
        updateContent(contentId);
      }
    });
  });

  function updateContent(contentId) {
    contents.forEach(content => {
      content.classList.add('d-none'); 
    });

    navmoreContent.classList.add('navmore__content-active');

    
      const selectedContent = document.getElementById(contentId);
      selectedContent.classList.remove('d-none');
    
  }

  tabs.forEach(tab => {
    tab.addEventListener('mouseout', function() {
      contents.forEach(content => {
        content.classList.remove('d-block');
      });
    });
  });

})();



function hideContent() {
  const navmoreContent = document.querySelector('.header__navmore-content');
  navmoreContent.classList.remove('navmore__content-active');

  const hideContentElements = document.querySelectorAll('.hide-content');
  hideContentElements.forEach(element => {
    element.classList.add('d-none');
  });
}

function hideContent() {
  const navmoreContent = document.querySelector('.header__navmore-content');
  navmoreContent.classList.remove('navmore__content-active');
}



// одноуровневые дропдавны
(function() {
  const dropdownBtns = document.querySelectorAll('.dropdown-btn');

  dropdownBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const parentDropdown = this.closest('.dropdown');
      const isDropdownActive = parentDropdown.classList.contains('active');

      dropdownBtns.forEach(otherBtn => {
        const otherParentDropdown = otherBtn.closest('.dropdown');
        if (otherParentDropdown !== parentDropdown) {
          otherParentDropdown.classList.remove('active');
        }
      });

      if (!isDropdownActive) {
        parentDropdown.classList.add('active');
      } else {
        parentDropdown.classList.remove('active'); 
      }
    });
  });



  const questions = document.querySelectorAll('.dropdown-btn');
  const answers = document.querySelectorAll('.dropdown-content');

  questions.forEach((question, index) => {
    question.addEventListener('click', () => {
      if (answers[index].style.maxHeight) {
        answers[index].style.maxHeight = null;
      } else {
        answers.forEach((answer, i) => {
          if (i !== index) {
            answer.style.maxHeight = null;
          }
        });
        answers[index].style.maxHeight = answers[index].scrollHeight + "px";
      }
    });
  });
})();


// фильтр акции 

(function() {
  var buttons = document.querySelectorAll('.filter-btn');

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
        var filter = this.getAttribute('data-filter');

        if (filter === 'all') {
            showAllItems();
        } else {
            filterItems(filter);
        }

        // Remove active class from all buttons
        buttons.forEach(function (btn) {
            btn.classList.remove('active');
        });

        // Add active class to the clicked button
        this.classList.add('active');
    });
});

function showAllItems() {
    var items = document.querySelectorAll('.filter-item');
    items.forEach(function (item) {
        item.style.display = 'block';
    });
}

function filterItems(category) {
    var items = document.querySelectorAll('.filter-item');
    items.forEach(function (item) {
        var dataCategory = item.getAttribute('data-category');
        if (dataCategory === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}
})();


// dropdawn города и языки

(function() {
  const dropdowns = document.querySelectorAll('.header__dropdown');

  dropdowns.forEach(function(dropdown) {
    const dropdownBtn = dropdown.querySelector('.header__dropdown-button');
    const dropdownContent = dropdown.querySelector('.header__dropdown-content');
    const input = document.querySelector('.header__dropdown-input');
    const citiesContainer = dropdown.querySelector('.header__dropdown-content-city');
    const languagesContainer = dropdown.querySelector('.header__dropdown-content-lang');

  
    function populateDropdown(container, data, clickHandler) {
      if (container) {
        data.forEach(function(item) {
          const option = document.createElement('a');
          option.href = '#';
          option.textContent = item;

          container.appendChild(option);

          option.addEventListener('click', function() {
            dropdownBtn.textContent = item;
            clickHandler();
          });
        });
      }
    }


    function toggleDropdown() {
      dropdownContent.classList.toggle('show');
      dropdownBtn.classList.toggle('dropdown-button--active');
    }


    const citiesData = ['Kharkiv', 'Kyiv', 'Івано-Франківськ'];
    populateDropdown(citiesContainer, citiesData, toggleDropdown);

    const languagesData = ['Укр', 'Рос', 'Eng'];
    populateDropdown(languagesContainer, languagesData, toggleDropdown);

    dropdownBtn.addEventListener('click', function() {
      toggleDropdown();
    });

    window.addEventListener('click', function(event) {
      if (!dropdown.contains(event.target)) {
        dropdownContent.classList.remove('show');
        dropdownBtn.classList.remove('dropdown-button--active');
      }
    });

    input.addEventListener('input', function() {
      const searchValue = input.value.toLowerCase();
      const options = dropdown.querySelectorAll('.header__dropdown-content a');

      options.forEach(function(option) {
        const optionText = option.textContent.toLowerCase();
        option.style.display = optionText.includes(searchValue) ? 'block' : 'none';
      });
    });

  });


})();

if(document.querySelector('.cookie-block')){
  const cookieEl = document.querySelector('.cookie-block');
  const okEl = document.querySelector('.cookie__btn-accept');
  const noEl = document.querySelector('.cookie__btn-cansel');
  
  
  
  okEl.addEventListener('click', () => {
      cookieEl.style.display = 'none';
  });
  
  
  
  
  function cookies(){
      if (!Cookies.get('hide-cookie')) {
          setTimeout(() => {
              cookieEl.style.display = 'block';
          }, 1000);
      }
  
      Cookies.set('hide-cookie', 'true', {
          expires: 30
      });
  }
  
  
  cookies();
}

