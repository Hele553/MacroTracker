import { openModal, closeModal, initModal, formatDate, addDays, getModalEntryId, getModalMode } from '../ui-helpers.js';
import { api } from '../api.js';

let statusOpen_diary__section_content = [false, false, false, false];

let selectedDate = new Date();


async function reloadDashboard(macros) {
    macros = Object.values(macros);
    document.querySelectorAll('.dashboard__macro')
        .forEach((macro, i) => {
            let elem = `<h3>${["Calories", "Carbs", "Protein", "Fats"][i]}</h3><div><p>${macros[i]} ${i == 0 ? 'kcal' : 'g'}</p></div>`;
            macro.innerHTML = elem;

            const p = macro.querySelector('p');
            p.classList.add('updated');
            p.addEventListener('animationend', () => {
                p.classList.remove('updated');
            }, { once: true });
        })
}

async function loadAllEntries() {
    let macros = {
        calories: 0,
        carbs: 0,
        protein: 0,
        fats: 0,
    }

    console.log(formatDate(selectedDate, 2))
    const { data } = await api.diary.getAll(formatDate(selectedDate, 2));
    document.getElementById(`diary__section_content_Breakfast`).innerHTML = '';
    document.getElementById(`diary__section_content_Lunch`).innerHTML = '';
    document.getElementById(`diary__section_content_Dinner`).innerHTML = '';
    document.getElementById(`diary__section_content_Snack`).innerHTML = '';

    for (let entry of data) {
        let tagEntry = document.createElement('div')
        tagEntry.className = "diary__section_element";

        const name = document.createElement('span');
        const wheight = document.createElement('span');
        const calories = document.createElement('span');
        const divOption = document.createElement('div');
        const mod = document.createElement('img');
        const bin = document.createElement('img');

        name.className = 'diary__section_element_name';
        wheight.className = 'diary__section_element_wheight';
        calories.className = 'diary__section_element_calories';
        divOption.className = 'diary__section_element_options';
        mod.setAttribute('src', 'assets/icon/pencil.png')
        mod.setAttribute('data-mod-btn', entry.meal)
        bin.setAttribute('src', 'assets/icon/delete.png')

        name.textContent = entry.name;
        wheight.textContent = `${entry.weight_grams} g`;
        calories.textContent = `${entry.calories} kcal`;

        tagEntry.appendChild(name);
        tagEntry.appendChild(wheight);
        tagEntry.appendChild(calories);
        divOption.appendChild(mod);
        divOption.appendChild(bin);
        tagEntry.appendChild(divOption);

        macros.calories += Math.floor(Number(entry.calories));
        macros.carbs += Math.floor(Number(entry.carbs));
        macros.protein += Math.floor(Number(entry.protein));
        macros.fats += Math.floor(Number(entry.fat));

        document.getElementById(`diary__section_content_${entry.meal}`).appendChild(tagEntry);

        bin.addEventListener('click', async () => {
            await api.diary.deleteOne(entry.entry_id);
            loadAllEntries();
        })

        mod.addEventListener('click', () => {
            openModal('modal_add', null, null, {
                entry_id: entry.entry_id,
                food_id: entry.food_id,
                weight_grams: entry.weight_grams,
                date: formatDate(selectedDate, 2),
                meal: entry.meal,
            })
        })
    }
    await reloadDashboard(macros)
    console.log(macros)
}

export function initDiary() {
    function updateDiaryDate() {
        document.querySelector('.calendar__selectedDate').textContent = formatDate(selectedDate, 1);
    }

    document.querySelectorAll('.calendare_btn1').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedDate = addDays(selectedDate, Number(btn.dataset.dayValue));
            updateDiaryDate();
            loadAllEntries();
        })
    })
    updateDiaryDate();

    initModal('modal_add');
    document.querySelectorAll('.openModal').forEach(btn => {
        btn.addEventListener('click', () => {
            openModal('modal_add', btn.dataset.addBtn, formatDate(selectedDate, 2));
        })
    })

    document.querySelectorAll('.diary__section_content_open').forEach((btn, i) => {
        btn.addEventListener('click', () => {
            if (statusOpen_diary__section_content[i]) {
                document.querySelectorAll('.diary__section_content')[i].style.maxHeight = '0px';
                document.querySelectorAll('.diary__section_content')[i].style.marginTop = '0px';
                btn.style.transform = 'rotate(0deg)';
            } else {
                document.querySelectorAll('.diary__section_content')[i].style.maxHeight = '1000px';
                document.querySelectorAll('.diary__section_content')[i].style.marginTop = '15px';
                btn.style.transform = 'rotate(-90deg)';
            }
            statusOpen_diary__section_content[i] = !statusOpen_diary__section_content[i];
        })
    })

    document.getElementById('btn-submit-modal')
        .addEventListener('click', async e => {
            e.preventDefault();

            const entry = {
                food_id: document.getElementById('campo-alimento').value,
                weight_grams: document.getElementById('campo-peso').value,
                date: document.getElementById('campo-data').value,
                meal: document.getElementById('campo-pasto').value,
            };

            try {
                if (getModalMode() === 'edit') {
                    await api.diary.updateOne(getModalEntryId(), entry);
                } else {
                    await api.diary.add(entry);
                }

                closeModal('modal_add');
                await loadAllEntries();
            } catch (err) {
                console.error(err.message);
            }
        })

    document.getElementById('btn-chiudi-modal').addEventListener('click', () => closeModal('modal_add'))
    document.getElementById('btn-annulla-modal').addEventListener('click', () => closeModal('modal_add'))

    loadAllEntries();
}