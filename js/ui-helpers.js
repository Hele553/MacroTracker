let currentModalMode = 'add';
let currentEntryId = null;

export function openModal(id, meal, date, entryToEdit = null) {
    const modal = document.getElementById(id);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    if (entryToEdit) {
        // Modalità EDIT
        currentModalMode = 'edit';
        currentEntryId = entryToEdit.entry_id;

        modal.querySelector('.modal__title').textContent = 'Edit entry';
        modal.querySelector('#btn-submit-modal span, #btn-submit-modal')
            .textContent = 'Save';  // oppure cambia solo il testo del bottone

        // Precompila i campi
        document.getElementById('campo-alimento').value = entryToEdit.food_id;
        document.getElementById('campo-peso').value = entryToEdit.weight_grams;
        document.getElementById('campo-data').value = entryToEdit.date ?? date;

        setActiveMealBtn(modal, entryToEdit.meal);
    } else {
        // Modalità ADD
        currentModalMode = 'add';
        currentEntryId = null;

        modal.querySelector('.modal__title').textContent = 'Add to the diary';
        // reset campi
        document.getElementById('campo-alimento').value = '';
        document.getElementById('campo-peso').value = 100;
        document.getElementById('campo-data').value = date;

        setActiveMealBtn(modal, meal);
    }
}

function setActiveMealBtn(modal, meal) {
    modal.querySelectorAll('.pasto-btn')
        .forEach(b => b.classList.remove('pasto-btn--active'));

    const target = meal?.toLowerCase();
    if (!target) return;

    modal.querySelectorAll('.pasto-btn').forEach(btn => {
        if (btn.dataset.pasto?.toLowerCase() === target) {
            btn.classList.add('pasto-btn--active');
            document.getElementById('campo-pasto').value = btn.dataset.pasto;
        }
    })
}

export function getModalMode() { return currentModalMode; }
export function getModalEntryId() { return currentEntryId; }

export function initModal(id) {
    const modal = document.getElementById(id);


    modal.querySelector('.modal__overlay')
        ?.addEventListener('click', () => closeModal(id));

    modal.querySelector('.modal__close')
        ?.addEventListener('click', () => closeModal(id));

    modal.querySelectorAll('.pasto-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.querySelectorAll('.pasto-btn')
                .forEach(b => b.classList.remove('pasto-btn--active'));
            btn.classList.add('pasto-btn--active');
            document.getElementById('campo-pasto').value = btn.dataset.pasto;
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal(id);
    });
}

export function closeModal(id) {
    const modal = document.getElementById(id);
    modal.hidden = true;
    document.body.style.overflow = '';
}

export function formatDate(date, type) {
    switch (type) {
        case 1: {
            function getSuffix(day) {
                if (day > 3 && day < 21) return 'th';

                switch (day % 10) {
                    case 1: return 'st';
                    case 2: return 'nd';
                    case 3: return 'rd';
                    default: return 'th';
                }
            }

            const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
            const day = date.getDate();
            const month = date.toLocaleDateString('en-US', { month: 'long' });
            const year = date.getFullYear();

            return `${weekday}, ${day}${getSuffix(day)} ${month} ${year}`;
        }

        case 2:
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
}

export function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}