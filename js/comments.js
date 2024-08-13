document.addEventListener("DOMContentLoaded", function () {
    // Вызывается после полной загрузки страницы

    // Функция для запроса данных с бэкенда
    function fetchData(url, callback) {
        // Ваша логика запроса данных, используйте AJAX или Fetch API
        // Пример с использованием Fetch API
        fetch(url)
            .then(response => response.json())
            .then(data => callback(data))
            .catch(error => console.error('Error fetching data:', error));
    }

    // Функция для рендеринга комментариев и ответов
    function renderComments(comments) {
        const commentsContainer = document.getElementById("commentsContainer");

        // Перебираем комментарии и добавляем их на страницу
        comments.forEach(comment => {
            const commentElement = createCommentElement(comment);
            commentsContainer.appendChild(commentElement);
        });
    }

    function addCommentElement(comment) {
        const commentsContainer = document.getElementById("commentsContainer");
        const commentElement = createCommentElement(comment);
        commentsContainer.appendChild(commentElement);
    }
    

    // Функция для создания HTML-элемента комментария
    function createCommentElement(comment) {
        // Ваша логика для создания HTML-элемента на основе комментария
        // Пример создания элемента
        const commentElement = document.createElement("div");
        commentElement.classList.add("comment");
        // Добавьте здесь логику для создания структуры комментария и кнопки "Читать ответы"
        // ...

        // Вешаем обработчик события на кнопку "Читать ответы"
        const readAnswersBtn = commentElement.querySelector(".read-all-answers-btn");
        if (readAnswersBtn) {
            readAnswersBtn.addEventListener("click", () => {
                // Здесь вызывайте функцию для загрузки ответов на этот комментарий
                // Можете использовать тот же механизм запроса данных с бэкенда
                // и добавить ответы в HTML-структуру
            });
        }

        return commentElement;
    }

    // Инициализация: загрузка комментариев при загрузке страницы
    // Инициализация: загрузка комментариев при загрузке страницы
    const commentsUrl = "/api/comments"; // Замените на реальный URL вашего бэкенда
    fetchData(commentsUrl, renderComments);

    // Пример добавления нового комментария (вызывается после создания комментария на сервере)
    const newComment = { /* ваш новый комментарий */ };
    addCommentElement(newComment);
    fetchData(commentsUrl, renderComments);
});