import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080', // tvoje URL backendu
});

// Interceptor: před každým odesláním požadavku se podívá do localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        // Pozor: Pokud tvůj backend zatím očekává "Basic", dej sem Basic.
        // Až budeme mít ostré JWT, změníme to na "Bearer".
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;