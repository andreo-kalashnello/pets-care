

document.addEventListener('DOMContentLoaded', async function () {

    
    const commentsContainer = document.getElementById('commentContainer');
    let comments;
    let displayedComments = 2;
    const countsCommentElement = document.querySelector('.countscoment span');
    const loadMoreButton = document.querySelector('.more__reviews');
    let isFilterApplied = false;
    let loadedComments = [];  // Массив для отслеживания загруженных комментариев
    let loadedAnswers = [];   // Массив для отслеживания загруженных ответов
    let loadedReplies = [];   // Массив для отслеживания загруженных ответов на ответы
    
    // Устанавливаем количество комментариев изначально
    countsCommentElement.textContent = arrOfComments.filter(comment => comment.parentId === null).length;

    // Функция для проверки, загружен ли уже комментарий с указанным id
    function isCommentLoaded(commentId) {
        return loadedComments.includes(commentId);
    }

    // Функция для проверки, загружен ли уже ответ с указанным id
    function isAnswerLoaded(answerId) {
        return loadedAnswers.includes(answerId);
    }

    // Функция для проверки, загружен ли уже ответ на ответ с указанным id
    function isReplyLoaded(replyId) {
        return loadedReplies.includes(replyId);
    }
    
    // Функция для получения комментариев из массива
    async function getCommentsFromBackend() {
        const comments = arrOfComments;
        console.log(comments);
        return comments;
    }
    
// Функция для загрузки дополнительных комментариев
async function loadMoreComments() {
    try {
        readFullText();
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
            // Иначе показываем следующие три комментария
            const newComments = comments.slice(displayedComments, displayedComments + 3);

            for (const comment of newComments) {
                if (comment.parentId === null && !isCommentLoaded(comment.id)) {
                    renderComments([comment]);
                    loadedComments.push(comment.id);  // Добавляем id в массив загруженных комментариев

                    // Загружаем ответы к комментарию только если они еще не загружены
                    if (!comment.answers) {
                        await getAnswersForComment(comment.id);
                    }
                }
            }

            // Увеличиваем количество показанных комментариев на основе ответов
            displayedComments += newComments.length + getAnswerCount(newComments);

        }
        getCountAnswers();

        // Проверяем, все ли комментарии уже загружены, и скрываем кнопку при необходимости
        if (displayedComments >= comments.length) {
            loadMoreButton.style.display = 'none';
        }

    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

async function loadMoreAnswers(commentId) {
    try {
        const comment = comments.find(comment => comment.id === commentId);

        // Если ответы к комментарию еще не загружены, загружаем их
        if (!comment.answers) {
            comment.answers = await getAnswersForComment(commentId);

            // Рендерим только те ответы, которые еще не были загружены
            const newAnswers = comment.answers.filter(answer => !isAnswerLoaded(answer.id));
            renderAnswers(newAnswers, commentId);

            // Добавляем id загруженных ответов в массив
            newAnswers.forEach(answer => loadedAnswers.push(answer.id));
        } else {
            // Иначе показываем все ответы
            renderAnswers(comment.answers, commentId, true);
        }
    } catch (error) {
        console.error(`Error loading answers for comment ${commentId}:`, error);
    }
}

async function loadMoreReplies(answerId) {
    try {
        const answer = comments.find(comment => comment.id === answerId);

        // Если ответы на ответы еще не загружены, загружаем их
        if (!answer.replies) {
            answer.replies = await getRepliesForAnswer(answerId);

            // Рендерим только те ответы на ответы, которые еще не были загружены
            const newReplies = answer.replies.filter(reply => !isReplyLoaded(reply.id));
            renderReplies(newReplies, answerId);

            // Добавляем id загруженных ответов на ответы в массив
            newReplies.forEach(reply => loadedReplies.push(reply.id));
        } else {
            // Иначе показываем все ответы на ответы
            renderReplies(answer.replies, answerId, true);
        }
    } catch (error) {
        console.error(`Error loading replies for answer ${answerId}:`, error);
    }
}

async function loadAllComments() {
    try {
        readFullText();
        // Если комментарии еще не загружены, загружаем их
        if (!comments) {
            comments = await getCommentsFromBackend();
        }

        for (let i = 0; i < comments.length; i++) {
            const comment = comments[i];
            if (comment.parentId === null) {
                renderComments([comment]);

                // Загружаем ответы к комментарию
                await getAnswersForComment(comment.id);
            }
        }

        getCountAnswers();

    } catch (error) {
        console.error('Error loading comments:', error);
    }
}


// Функция для получения количества ответов к комментариям
function getAnswerCount(commentsArray) {
    let answerCount = 0;
    commentsArray.forEach(comment => {
        answerCount += arrOfComments.filter(innerComment => innerComment.parentId === comment.id).length;
    });
    return answerCount;
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
                        <a class="reveiew__btn">
                            <img src="/img/orange-star.svg" alt="">
                            <span>${comment.rate}</span>
                        </a>
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
         // Проверяем, есть ли вообще контейнер для ответов
        if (answersContainer) {
            // Скрываем ответы, если их больше двух
            if (index + 1 >= 2) {
                answerElement.classList.add('hidden-answer');
            }

            answersContainer.appendChild(answerElement);
        }
    });

}


function readFullText() {
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
}

    // Добавляем слушатель события на кнопку "Загрузить еще"
    loadMoreButton.addEventListener('click', async function (event) {
        event.preventDefault();
        await loadMoreComments();
        // Проверяем, применены ли фильтры, и скрываем кнопку "Больше отзывов" при необходимости
        if (isFilterApplied) {
            loadMoreButton.style.display = 'none';
        }
        if (getSelectedRatings().length > 0) {
            await filterComments();
        }
        readFullText();
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
function checkAnswer() {
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
        // for (let i = 0; i < 2; i++) {
        //     answerWraps[i].style.display = 'flex';
        // }
    
        // Добавляем слушатели событий на кнопки "читать все ответы"
        readAllAnswersButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                for (let i = 2; i < answerWraps.length; i++) {
                    answerWraps[i].style.display = (answerWraps[i].style.display === 'none' || answerWraps[i].style.display === '') ? 'flex' : 'none';
                }
                button.classList.toggle('active');
            });
        });
}
checkAnswer();

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

    readFullText();

    const ratings = arrOfComments
    .filter(comment => comment.parentId === null && comment.rate !== undefined)
    .map(comment => comment.rate);

    // Вычисляем среднее значение рейтинга
    const averageRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b) / ratings.length).toFixed(1) : '0.0';

    // Присваиваем значение рейтинга
    document.querySelector('.rating__value-comment').innerHTML = averageRating;

    

    // Обработчик события для кнопки "Фильтровать"
    document.getElementById('filterButton').addEventListener('click', async function () {
        await filterComments();
        checkAnswer();
        readFullText();
        loadMoreButton.style.display = 'none';
    });

    // Обработчик события для кнопки "Сбросить фильтр"
    document.getElementById('resetFilterButton').addEventListener('click', async function () {
        resetFilter();
        await filterComments();
        checkAnswer();
        readFullText();

        if (getSelectedRatings().length === 0) {
            loadMoreButton.style.display = 'none';
        } 
    });

    async function filterComments() {
        const selectedRatings = getSelectedRatings();

        if (selectedRatings.length === 0) {
            // Очищаем контейнер перед рендерингом новых комментариев
            clearCommentsContainer();
            // Если не выбраны рейтинги, загружаем все комментарии
            await loadAllComments();
        } else {

            // Очищаем контейнер перед рендерингом новых комментариев
            clearCommentsContainer();

            // Фильтруем комментарии в соответствии с выбранными рейтингами
            const filteredComments = comments.filter(comment => selectedRatings.includes(comment.rate));
            const filteredAnswers = comments.filter(comment => selectedRatings.includes(comment.rate) && comment.parentId !== null);

            // Загружаем все ответы на фильтрованные комментарии
            for (const comment of filteredComments) {
                renderComments([comment]);
                await getAnswersForComment(comment.id);
            }

            // Загружаем все ответы на фильтрованные ответы
            for (const answer of filteredAnswers) {
                await getAnswersForComment(answer.id);
            }

            getCountAnswers();

            // Скрываем кнопку "Больше отзывов", если все отзывы уже загружены
            if (displayedComments >= comments.length) {
                loadMoreButton.style.display = 'none';
            }
        }
    }

    function resetFilter() {
        displayedComments = 2;
        // Снимаем галочки с чекбоксов
        const checkboxes = document.querySelectorAll('input[name="rating"]');
        checkboxes.forEach(checkbox => checkbox.checked = false);
        // Отобразим все комментарии
        renderComments(comments);
    }


    function getSelectedRatings() {
        const checkboxes = document.querySelectorAll('input[name="rating"]:checked');
        return Array.from(checkboxes).map(checkbox => parseInt(checkbox.value));
    }

    function renderFilteredComments(filteredComments) {
    
        // Рендерим новые отфильтрованные комментарии
        for (let i = 0; i < 2 && i < filteredComments.length; i++) {
            const comment = filteredComments[i];
            if (comment.parentId === null) {
                renderComments([comment]);

            }
        }
        filteredComments.forEach(comment => {
            getAnswersForComment(comment.id);
        });
    

        getCountAnswers();
    }

    function clearCommentsContainer() {
        if (commentsContainer) {
            commentsContainer.innerHTML = '';
            displayedComments = 0;
        }
    }
    loadMoreButton.style.display = 'block';


    function updateRatingBars() {
        const ratingCheckboxes = document.querySelectorAll('input[name="rating"]');
        const uniqueRatings = [...new Set(arrOfComments.map(comment => comment.rate))];
        
        uniqueRatings.forEach(ratingValue => {
            const count = arrOfComments.filter(comment => comment.parentId === null && comment.rate === ratingValue).length;
            const totalRatingCount = arrOfComments.filter(comment => comment.parentId === null && comment.rate !== undefined).length;
            const percentage = totalRatingCount > 0 ? (count / totalRatingCount * 100) : 0;
    
            ratingCheckboxes.forEach(ratingCheckbox => {
                if (parseInt(ratingCheckbox.value) === ratingValue) {
                    const label = ratingCheckbox.closest('label');
                    if (label) {
                        const bar = label.querySelector('.rating-bar .fill');
                        if (bar) {
                            bar.style.width = percentage + '%';
                        }
    
                        const countLabel = label.querySelector('.rating-count');
                        if (countLabel) {
                            countLabel.textContent = count;
                        }
                    }
                }
            });
        });
    }
    
    
    updateRatingBars();

});

