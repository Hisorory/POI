document.addEventListener('DOMContentLoaded', function () {
    var guestLoginButton = document.querySelector('.guest-login');
    guestLoginButton.addEventListener('click', function () {
        window.location.href = 'home.html';
    });
});
