document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registrationForm');
    registrationForm.addEventListener('submit', function (event) {
        event.preventDefault();

        if (validateForm()) {
            showSuccessModal();
            resetForm();
        }
    });

    function validateForm() {
        const nameInput = document.getElementById('name');
        const surnameInput = document.getElementById('surname');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const locationInput = document.getElementById('location');
        const roleInput = document.getElementById('role');
        const commentInput = document.getElementById('comment');
        const agreementCheckbox = document.getElementById('agreementCheckbox');

        // Простая проверка, что все поля не пустые
        if (
            nameInput.value.trim() === '' ||
            surnameInput.value.trim() === '' ||
            emailInput.value.trim() === '' ||
            phoneInput.value.trim() === '' ||
            locationInput.value.trim() === '' ||
            roleInput.value === '' ||
            commentInput.value.trim() === '' ||
            !agreementCheckbox.checked
        ) {
            alert('Заполните все поля формы и поставьте галочку о согласии на обработку данных.');
            return false;
        }

        return true;
    }

    function showSuccessModal() {
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
    }

    function resetForm() {
        registrationForm.reset();
    }

    window.closeModal = function () {
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.hide();
    };
});