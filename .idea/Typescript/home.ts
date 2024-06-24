document.addEventListener('DOMContentLoaded', () => {
    const moreIdeasButton = document.querySelector('.more-ideas-btn') as HTMLButtonElement;

    moreIdeasButton.addEventListener('click', () => {
        window.location.href = 'startseite.html';
    });
});
