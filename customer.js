document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const buttons = document.querySelectorAll('.animate-button');

    buttons.forEach((button, index) => {
        setTimeout(() => {
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        }, 500 * index);
    });

    // Set body opacity to 1 after the animation
    body.style.opacity = '1';
});

function redirectToLogin() {
    window.location.href = 'login.php'; // Replace with the actual path to your customer page
}

function redirectToMap() {
    window.location.href = 'index.html'; // Replace with the actual path to your staff page
}
