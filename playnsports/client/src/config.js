// configuration constants for client-side environment variables
// VITE_ prefix is required by Vite for env vars exposed to code

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
