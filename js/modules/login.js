import { api } from '../api.js';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginBtn').addEventListener('click', async () => {
        try {
            await api.auth.login({
                username: document.getElementById('login-user').value,
                password: document.getElementById('login-pass').value,
            })
            window.location.href = 'index.html';
        } catch (err) {
            const error = document.getElementById('login-error');
            error.textContent = err.message;
            error.style.display = 'block';
        }
    })
})