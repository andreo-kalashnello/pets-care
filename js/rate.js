document.addEventListener('DOMContentLoaded', async function () {
    const ratings = document.querySelectorAll('.rating');
    if (ratings.length > 0) {
        initRatings();
    }

    function initRatings() {
        ratings.forEach((rating) => {
            initRating(rating);
        });

        function initRating(rating) {
            const ratingActive = rating.querySelector('.rating__active');
            const ratingValue = rating.querySelector('.rating__value');

            setRatingActiveWidth();

            function setRatingActiveWidth() {
                const ratingValueNumber = parseFloat(ratingValue.innerHTML);
                const ratingActiveWidth = (ratingValueNumber / 5) * 100; // 5 is the maximum rating
                ratingActive.style.width = `${ratingActiveWidth}%`;
            }
        }
    }
});
























