export function openModal(id) {
    const modal = document.getElementById(id);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
}

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