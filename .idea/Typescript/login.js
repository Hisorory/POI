document.addEventListener('DOMContentLoaded', function () {
    // Auswahl der Buttons und Eingabefelder
    var guestLoginButton = document.querySelector('.guest-login');
    var loginButton = document.querySelector('.login');
    var usernameInput = document.getElementById('username');
    var passwordInput = document.getElementById('password');
    // Event-Listener für den Gast-Login-Button
    guestLoginButton.addEventListener('click', function () {
        window.location.href = 'home.html'; // Weiterleitung zur Gast-Login-Seite
    });
    // Event-Listener für den Login-Button
    loginButton.addEventListener('click', function (event) {
        event.preventDefault(); // Verhindern des Standardverhaltens des Formular-Submit-Buttons
        var username = usernameInput.value;
        var password = passwordInput.value;
        if (username === 'admin123' && password === 'passwort1') {
            window.location.href = 'startseite.html'; // Weiterleitung zur Admin-Seite bei erfolgreicher Anmeldung
        }
        else {
            alert('Invalid username or password'); // Fehlermeldung bei ungültigen Anmeldeinformationen
        }
    });
});
