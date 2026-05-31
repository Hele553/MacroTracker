import { api } from '../api.js';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('registerBtn').addEventListener('click', async () => {
        const error = document.getElementById('reg-error');
        error.style.display = 'none';

        const username = document.getElementById('reg-user').value.trim();
        const email    = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-pass').value;
        const calories = document.getElementById('reg-calories').value;

        if (!username || !email || !password || !calories) {
            error.textContent = 'Compila tutti i campi';
            error.style.display = 'block';
            return;
        }

        try {
            await api.auth.register({ username, email, password, daily_calories: calories });
            await api.auth.login({ username, password });
            window.location.href = 'index.html';
        } catch (err) {
            error.textContent = err.message;
            error.style.display = 'block';
        }
    });
});