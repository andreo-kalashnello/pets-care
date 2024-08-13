document.addEventListener('DOMContentLoaded', function () {
    const subscribeForm = document.getElementById('subscribeForm');
    subscribeForm.addEventListener('submit', function (event) {
        event.preventDefault(); 

        if (validateForm()) {
            showSuccessModal();
        }
    });

    function validateForm() {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');

        // Простая проверка, что все поля не пустые
        if (nameInput.value.trim() === '' || emailInput.value.trim() === '' || phoneInput.value.trim() === '') {
            alert('Заполните все поля формы.');
            return false;
        }


        return true;
    }

    function showSuccessModal() {
        const successModal = document.getElementById('successModal');
        successModal.style.display = 'block';
        successModal.style.opacity = 1;

        // Очистка значений полей формы
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');

        nameInput.value = '';
        emailInput.value = '';
        phoneInput.value = '';
    }

    window.closeModal = function () {
        const successModal = document.getElementById('successModal');
        successModal.style.display = 'none';
        successModal.style.opacity = 0;
    };
});