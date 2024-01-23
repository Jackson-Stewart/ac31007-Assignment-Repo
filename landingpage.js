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

function redirectToCustomer() {
    window.location.href = 'customer.html'; // Replace with the actual path to your customer page
}

function redirectToStaff() {
    window.location.href = 'staff.html'; // Replace with the actual path to your staff page
}
