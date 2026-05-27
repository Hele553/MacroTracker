const BASE = '/MacroTracker/php';
async function request(endpoint, options = {}) {
    const res = await fetch(BASE + endpoint, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    })
    const data = await res.json(); 

    if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
    }

    return data;
}

export const api = {
    diary: {
        getAll: (date) => request(`/diary?date=${date}`, {method: 'GET'}),
        add: (meal) => request('/diary', { method: 'POST', body: JSON.stringify(meal) }),
        updateOne: (id, meal) => request(`/diary/${id}`, { method: 'PUT', body: JSON.stringify(meal) }),
        deleteOne: (id) => request(`/diary/${id}`, {method: 'DELETE'})
    },
    food: {
        getAll: () => request('/food', {method: 'GET'}), 
    }
}