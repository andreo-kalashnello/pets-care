function validateForm() {
    let nameInput = document.getElementById('letterFormControlInput1');
    let phoneInput = document.getElementById('letterFormControlInput2');
    let textareaInput = document.getElementById('letterFormControlTextarea1');

    // Пример валидации для демонстрации - проверка наличия значений в полях
    if (nameInput.value && phoneInput.value && textareaInput.value) {
        // Валидация успешна, открываем модальное окно
        document.getElementById('successModal').classList.add('show');
        document.getElementById('successModal').style.display = 'block';
        nameInput.value = '';
        phoneInput.value = '';
        textareaInput.value = '';
        return false; // Отменить отправку формы
    } else {
        return false; // Отменить отправку формы
    }
}

function closeModal() {
    document.getElementById('successModal').classList.remove('show');
    document.getElementById('successModal').style.display = 'none';
}