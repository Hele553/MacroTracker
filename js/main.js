import { initDiary }    from './modules/diary.js';
import { initFood } from './modules/food.js';

document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    initDiary();
    initFood();
})