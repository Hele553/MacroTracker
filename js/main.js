import { api } from './api.js';
import { initDiary } from './modules/diary.js';
import { initFood } from './modules/food.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const { data } = await api.auth.me();

        const span = document.querySelector('.sidebar__utente span');
        span.textContent = data.username;

        const utente = document.getElementById('sidebar__utente');
        utente.removeAttribute('href');
        utente.style.cursor = 'pointer';
        utente.addEventListener('click', async () => {
            await api.auth.logout();
            window.location.href = 'login.html';
        });

    } catch {
        window.location.href = 'login.html';
        return;
    }

    initDiary();
    initFood();
});