import { api } from '../api.js';

async function loadForm(obj) {
    const select = document.getElementById('campo-alimento')
    for (let index = 0; index < obj.data.length; index++) {
        const {food_id, name} = obj.data[index];
        select.innerHTML += `<option value="${food_id}">${name}</option>`
    }

    let label = ['kcal', 'carb', 'prot', 'gras']
    label = label.map(e => document.getElementById(`m-${e}`))
    select.addEventListener('change', event => {
        label[0].textContent = obj.data[event.target.value].calories
        label[1].textContent = obj.data[event.target.value].carbs
        label[2].textContent = obj.data[event.target.value].protein
        label[3].textContent = obj.data[event.target.value].fat
    })
}

export async function initFood() {
    const food = await api.food.getAll();
    await loadForm(food)
}