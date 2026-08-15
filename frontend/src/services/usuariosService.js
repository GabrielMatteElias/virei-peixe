import { peixesIniciais } from '../dados/peixes';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://virei-peixe-production.up.railway.app';
// const API_BASE_URL = 'http://localhost:8000';

export async function buscarPeixes() {
    try {
        const response = await fetch(`${API_BASE_URL}/usuario/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Falha ao buscar a lista de peixes.');
        }

        return await response.json();
    } catch {
        return peixesIniciais;
    }
}