document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.animate-button');

    buttons.forEach((button, index) => {
        setTimeout(() => {
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        }, 500 * index);
    });
});

function redirectToCustomer() {
    window.location.href = 'customer.html'; // Replace with the actual path to your customer page
}

function redirectToStaff() {
    window.location.href = 'index.html'; // Replace with the actual path to your staff page
}