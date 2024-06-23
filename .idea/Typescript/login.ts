document.addEventListener('DOMContentLoaded', () => {
    const guestLoginButton = document.querySelector('.guest-login') as HTMLButtonElement;

    guestLoginButton.addEventListener('click', () => {
        window.location.href = 'home.html';
    });
});
