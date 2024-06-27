document.addEventListener('DOMContentLoaded', () => {
    // Auswahl der Buttons und Eingabefelder
    const guestLoginButton = document.querySelector('.guest-login') as HTMLButtonElement;
    const loginButton = document.querySelector('.login') as HTMLButtonElement;
    const usernameInput = document.getElementById('username') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    // Event-Listener für den Gast-Login-Button
    guestLoginButton.addEventListener('click', () => {
        window.location.href = 'home.html'; // Weiterleitung zur Gast-Login-Seite
    });

    // Event-Listener für den Login-Button
    loginButton.addEventListener('click', (event) => {
        event.preventDefault(); // Verhindern des Standardverhaltens des Formular-Submit-Buttons

        const username = usernameInput.value;
        const password = passwordInput.value;

        if (username === 'admin123' && password === 'passwort1') {
            window.location.href = 'startseite.html'; // Weiterleitung zur Admin-Seite bei erfolgreicher Anmeldung
        } else {
            alert('Invalid username or password'); // Fehlermeldung bei ungültigen Anmeldeinformationen
        }
    });
});
