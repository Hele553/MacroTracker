import { api } from '../api.js';

async function loadForm(obj) {
    const select = document.getElementById('campo-alimento')
    for (let index = 0; index < obj.data.length; index++) {
        const { food_id, name } = obj.data[index];
        select.innerHTML += `<option value="${food_id}">${name}</option>`
    }

    let label = ['kcal', 'carb', 'prot', 'gras']
    label = label.map(e => document.getElementById(`m-${e}`))
    select.addEventListener('change', event => {
        const food = obj.data.find(f => f.food_id == event.target.value);
        if (!food) return;
        label[0].textContent = food.calories;
        label[1].textContent = food.carbs;
        label[2].textContent = food.protein;
        label[3].textContent = food.fat;
    })
}

export async function initFood() {
    const food = await api.food.getAll();
    console.log('food response:', food);
    await loadForm(food)
}