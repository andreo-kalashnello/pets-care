
document.addEventListener('DOMContentLoaded', async function () {

    // Функция для получения комментариев из массива
    async function getCommentsFromBackend() {
        const comments = arrOfComments;
        console.log(comments);
        return comments;
    }

    const commentsContainer = document.getElementById('commentContainer');
    let comments;
    let displayedComments = 2;
    const countsCommentElement = document.querySelector('.countscoment span');
    const loadMoreButton = document.querySelector('.more__reviews');

    // Устанавливаем количество комментариев изначально
    countsCommentElement.textContent = arrOfComments.length;


// Функция для загрузки дополнительных комментариев
async function loadMoreComments() {
    try {
        // Если комментарии еще не загружены, загружаем их
        if (!comments) {
            comments = await getCommentsFromBackend();

            // Отображаем только первые два комментария
            for (let i = 0; i < 2 && i < comments.length; i++) {
                const comment = comments[i];
                if (comment.parentId === null) {
                    renderComments([comment]);

                    // Загружаем ответы к комментарию
                    await getAnswersForComment(comment.id);
                } 
            }

        } else {
            // Иначе показываем следующие 5 комментария
            const newComments = comments.slice(displayedComments, displayedComments + 5);

            for (const comment of newComments) {
                if (comment.parentId === null) {
                    renderComments([comment]);

                    // Загружаем ответы к комментарию
                    await getAnswersForComment(comment.id);
                }
            }

            displayedComments += (newComments.length);

            // Если показаны все комментарии, отключаем кнопку "Загрузить еще"
            if (displayedComments == comments.length) {
                loadMoreButton.disabled = true;
                loadMoreButton.style.display = 'none'; // Добавленная строка

                // Проверяем, если кнопка больше не нужна, скрываем её
                if (comments.length == 0) {
                    loadMoreButton.style.display = 'none';
                }
            }
        }
        getCountAnswers();

    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

// Функция для получения всех ответов к комментарию по его ID (рекурсивно)
function getAnswersForComment(commentId) {
    try {
        // Фильтруем массив комментариев, чтобы получить только те,
        // которые являются ответами на указанный комментарий
        const answers = arrOfComments.filter(comment => comment.parentId === commentId);

        // Отображаем полученные ответы
        renderAnswers(answers, commentId);

        // Рекурсивно вызываем эту же функцию для каждого полученного ответа
        answers.forEach(answer => {
            getAnswersForComment(answer.id);
        });

    } catch (error) {
        console.error(`Error loading answers for comment ${commentId}:`, error);
    }
}

    // Функция для рендеринга комментариев
function renderComments(commentsArray) {
    commentsArray.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'review';
        commentElement.innerHTML = `
            <div class="review__wrap coment-wrap" id="${comment.id}">
                <div class="review__wrap-info">
                    <div class="review__top d-flex justify-content-between">
                        <h6 class="reveiew__author">
                            ${comment.author}
                        </h6>
                        <div class="">
                            <span class="articlle__bottom-date">
                                ${comment.date}
                            </span>
                        </div>
                    </div>
                    <div class="reveiew__text-wrap">
                        <p class="reveiew__text">
                            ${comment.text}
                        </p>
                        
                    </div>
                    <div class="reveiew__btns d-flex">
                        <a class="reveiew__btn reveiew__btn-gr">
                            <img src="/img/green-like.svg" alt="">
                            <span>${comment.likes}</span>
                        </a>
                        <a class="reveiew__btn reveiew__btn-or">
                            <img src="/img/orange-dislike.svg" alt="">
                            <span>${comment.dislikes}</span>
                        </a>
                        <a class="reveiew__btn reveiew__btn-gr">
                            <span class="count__answers">0</span>
                            <span>Ответов</span>
                        </a>
                    </div>
                    <a class="review__answer-btn" href="#">Ответить</a>

                    <div class="do-answer d-flex flex-column align-items-end">
                        <form class="reviews__form" action="">
                            <div class="reviews__input-wrap d-flex flex-column">
                                <label class="reviews__input-label" for="">
                                    <span class="red">*</span>
                                    <span>Введите ваше имя и фамилию</span>
                                </label>
                                <input class="form-control reviews__input" type="text" placeholder="Якілевський Богдан">
                            </div>
                            <div class="reviews__input-wrap d-flex flex-column">
                                <label class="reviews__input-label" for="">
                                    <span class="red">
                                        *
                                    </span>
                                    <span>
                                        Текст комментария
                                    </span>
                                </label>
                                <textarea class="form-control reviews__textarea" name="" id="" rows="7" placeholder="Ваш коментар"></textarea>
                            </div>
                            <div class="reviews__form-bottom d-flex justify-content-between">
                                <input class="reviews__form-button" type="submit" value="Комментировать">
                                <div class="reviews__input-label ms-3">
                                    <span class="red">
                                        *
                                    </span>
                                    <span>
                                        - обов'язкове поле
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        // Находим или создаем контейнер для комментариев
        let commentsContainer = document.getElementById('commentContainer');
        if (!commentsContainer) {
            commentsContainer = document.createElement('div');
            commentsContainer.id = 'commentContainer';
            document.body.appendChild(commentsContainer);
        }

        commentsContainer.appendChild(commentElement);

        // Рендерим ответы на комментарий, если они существуют
        if (comment.answers) {
            renderAnswers(comment.answers, comment.id);
        }
    });
}

// Функция для рендеринга ответов
function renderAnswers(answersArray, parentId) {
    const answersContainer = document.getElementById(parentId);

    answersArray.forEach((answer, index) => {
        const answerElement = document.createElement('div');
        answerElement.className = 'answer-wrap justify-content-end coment-wrap';
        answerElement.innerHTML = `
            <div class="answer-wrap d-flex justify-content-end coment-wrap" id="${answer.id}">
                <div class="answer__info-wrap">
                <div class="answer">
                    <div class="review__top d-flex justify-content-between">
                        <h6 class="reveiew__author">
                            ${answer.author}
                        </h6>
                        <div class="">
                            <span class="articlle__bottom-date">
                                ${answer.date}
                            </span>
                        </div>
                    </div>
                    <div class="reveiew__text-wrap">
                        <p class="reveiew__text">
                            ${answer.text}
                        </p>
                        
                    </div>
                    <div class="reveiew__btns d-flex">
                        <a class="reveiew__btn reveiew__btn-gr">
                            <img src="/img/green-like.svg" alt="">
                            <span>${answer.likes}</span>
                        </a>
                        <a class="reveiew__btn reveiew__btn-or">
                            <img src="/img/orange-dislike.svg" alt="">
                            <span>${answer.dislikes}</span>
                        </a>
                    </div>
                    <a class="review__answer-btn" href="#">Ответить</a>

                    <div class="do-answer d-flex flex-column align-items-end">
                        <form class="reviews__form" action="">
                            <div class="reviews__input-wrap d-flex flex-column">
                                <label class="reviews__input-label" for="" >
                                    <span class="red">*</span>
                                    <span>Введите ваше имя и фамилию</span>
                                </label>
                                <input class="form-control reviews__input" type="text" placeholder="Якілевський Богдан">
                            </div>
                            <div class="reviews__input-wrap d-flex flex-column">
                                <label class="reviews__input-label" for="">
                                    <span class="red">
                                        *
                                    </span>
                                    <span>
                                        Текст комментария
                                    </span>
                                </label>
                                <textarea class="form-control reviews__textarea" name="" id="" rows="7" placeholder="Ваш коментар"></textarea>
                            </div>
                            <div class="reviews__form-bottom d-flex justify-content-between">
                                <input class="reviews__form-button" type="submit" value="Комментировать">
                                <div class="reviews__input-label ms-3 d-none d-sm-block">
                                    <span class="red">
                                        *
                                    </span>
                                    <span>
                                        - обов'язкове поле
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                </div>
            </div>
        `;
        // Скрываем ответы, если их больше двух
        if (index + 1 >= 2) {
            answerElement.classList.add('hidden-answer');
        }

        answersContainer.appendChild(answerElement);
    });

}


    // Добавляем слушатель события на кнопку "Загрузить еще"
    loadMoreButton.addEventListener('click', async function (event) {
        event.preventDefault();
        await loadMoreComments();
        // Находим все текстовые блоки комментариев
        const reviewTexts = document.querySelectorAll('.reveiew__text');

        // Проверяем каждый текстовый блок
        reviewTexts.forEach(function (textElement) {
            // Проверяем, есть ли уже кнопка "Читать весь отзыв"
            if (!textElement.parentNode.querySelector('.review__text-btn')) {
                // Получаем высоту текста и высоту строки
                const textHeight = textElement.scrollHeight;
                const lineHeight = parseInt(window.getComputedStyle(textElement).lineHeight);
        
                // Вычисляем количество строк текста
                const textLines = Math.floor(textHeight / lineHeight);
        
                // Если количество строк больше 4, добавляем кнопку "Читать весь отзыв"
                if (textLines > 4) {
                    const readMoreButton = document.createElement('button');
                    readMoreButton.className = 'review__text-btn';
                    readMoreButton.textContent = 'Читать весь отзыв';
        
                    // Добавляем слушатель события на кнопку
                    readMoreButton.addEventListener('click', function () {
                        textElement.classList.toggle('expanded');
                        if (textElement.classList.contains('expanded')) {
                            readMoreButton.textContent = 'Свернуть';
                        } else {
                            readMoreButton.textContent = 'Читать весь отзыв';
                        }
                    });
        
                    // Вставляем кнопку после текстового блока
                    textElement.parentNode.appendChild(readMoreButton);
                }
            }
        });
        if (displayedComments >= comments.length) {
            loadMoreButton.disabled = true;
            loadMoreButton.style.display = 'none'; // Добавленная строка
        }
    });

    // Загружаем первоначальные комментарии
    await loadMoreComments();

    function getCountAnswers() {
        // Получаем все элементы с классом 'count__answer'
        const countAnswers = document.querySelectorAll('.count__answers');
        // Устанавливаем текстовое содержание countAnswer равным количеству ответов

        // Проходим по каждому элементу
countAnswers.forEach(countAnswer => {
    const review = countAnswer.closest('.review');
    const answersInReview = review.querySelectorAll('.answer-wrap');

    // Первые два ответа видны всегда
    answersInReview.forEach((answer, index) => {
        // Устанавливаем текстовое содержание countAnswer равным количеству ответов
    countAnswer.textContent = answersInReview.length / 2;
    });

});
        
}
// Получаем все элементы с классом 'count__answer'
const countAnswers = document.querySelectorAll('.count__answers');

// Проходим по каждому элементу
countAnswers.forEach(countAnswer => {
    const review = countAnswer.closest('.review');
    const answersInReview = review.querySelectorAll('.answer-wrap');

    // Первые два ответа видны всегда
    answersInReview.forEach((answer, index) => {
        if (index >= 2) {
            answer.style.display = 'none';
        }
    });

    // Если ответов больше двух, добавляем кнопку "Показать все ответы"
    if (answersInReview.length > 2) {
        const showAllButton = document.createElement('button');
        showAllButton.classList.add('showmore-answ__btn');
        showAllButton.textContent = 'Читати всі відповіді';
        showAllButton.addEventListener('click', function () {
            // При клике на кнопку, отображаем все ответы
            answersInReview.forEach(answer => {
                answer.style.display = 'block';
            });

            // Скрываем кнопку "Показать все ответы"
            showAllButton.style.display = 'none';
        });

        // Вставляем кнопку в review
        review.appendChild(showAllButton);
    }

    // Устанавливаем текстовое содержание countAnswer равным количеству ответов
    countAnswer.textContent = answersInReview.length / 2;
});



    // Находим все формы комментариев
    const forms = document.querySelectorAll('.reviews__form');

    // Добавляем слушатели событий на поля ввода имени и комментария
    forms.forEach(function (form) {
        const nameInput = form.querySelector('.reviews__input');
        const commentInput = form.querySelector('.reviews__textarea');
        const submitButton = form.querySelector('.reviews__form-button');

        nameInput.addEventListener('input', updateButtonState);
        commentInput.addEventListener('input', updateButtonState);

        // Функция обновления состояния кнопки отправки
        function updateButtonState() {
            const isNameFilled = nameInput.value.trim() !== '';
            const isCommentFilled = commentInput.value.trim() !== '';

            if (isNameFilled && isCommentFilled) {
                submitButton.classList.add('active');
            } else {
                submitButton.classList.remove('active');
            }
        }
    });

    // Находим родительский элемент для кнопок ответа
const commentContainer = document.getElementById('commentContainer');

// Добавляем слушатель событий на родителя
commentContainer.addEventListener('click', function (event) {
    // Проверяем, является ли цель клика кнопкой ответа
    if (event.target.classList.contains('review__answer-btn')) {
        event.preventDefault();
        const form = event.target.nextElementSibling.querySelector('.reviews__form');
        form.style.display = (form.style.display === 'none' || form.style.display === '') ? 'block' : 'none';
    }
});

    // Находим блоки с ответами
    const answerWraps = document.querySelectorAll('.answer-wrap');
    const readAllAnswersButtons = document.querySelectorAll('.read-all-answers-btn');

    // Показываем первые два блока с ответами
    for (let i = 0; i < 2; i++) {
        answerWraps[i].style.display = 'flex';
    }

    // Добавляем слушатели событий на кнопки "читать все ответы"
    readAllAnswersButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            for (let i = 2; i < answerWraps.length; i++) {
                answerWraps[i].style.display = (answerWraps[i].style.display === 'none' || answerWraps[i].style.display === '') ? 'flex' : 'none';
            }
            button.classList.toggle('active');
        });
    });

    // Функция для переключения текста кнопки "Читать весь отзыв"
    function toggleText(button) {
        var textElement = button.previousElementSibling;

        textElement.classList.toggle("expanded");

        if (textElement.classList.contains("expanded")) {
            button.textContent = "Свернуть";
        } else {
            button.textContent = "Читать весь отзыв";
        }
    }


    // Находим все кнопки "Читать весь отзыв" и добавляем слушатели событий
    const buttons = document.querySelectorAll('.review__text-btn');
    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            toggleText(button);
        });
    });

    // Находим все текстовые блоки комментариев
    const reviewTexts = document.querySelectorAll('.reveiew__text');

// Проверяем каждый текстовый блок
reviewTexts.forEach(function (textElement) {
    // Проверяем, есть ли уже кнопка "Читать весь отзыв"
    if (!textElement.parentNode.querySelector('.review__text-btn')) {
        // Получаем высоту текста и высоту строки
        const textHeight = textElement.scrollHeight;
        const lineHeight = parseInt(window.getComputedStyle(textElement).lineHeight);

        // Вычисляем количество строк текста
        const textLines = Math.floor(textHeight / lineHeight);

        // Если количество строк больше 4, добавляем кнопку "Читать весь отзыв"
        if (textLines > 4) {
            const readMoreButton = document.createElement('button');
            readMoreButton.className = 'review__text-btn';
            readMoreButton.textContent = 'Читать весь отзыв';

            // Добавляем слушатель события на кнопку
            readMoreButton.addEventListener('click', function () {
                textElement.classList.toggle('expanded');
                if (textElement.classList.contains('expanded')) {
                    readMoreButton.textContent = 'Свернуть';
                } else {
                    readMoreButton.textContent = 'Читать весь отзыв';
                }
            });

            // Вставляем кнопку после текстового блока
            textElement.parentNode.appendChild(readMoreButton);
        }
    }
});

});