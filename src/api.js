import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_URL
});

export const fetchPulse = () => api.get('/pulse');
export const updatePulseStatus = (id, status) => api.patch(`/pulse/${id}`, { status });

export const fetchPosts = () => api.get('/posts');
export const createPost = (postData) => api.post('/posts', postData);
export const deletePost = (id) => api.delete(`/posts/${id}`);

export const fetchPrinters = () => api.get('/printers');
export const updatePrinterStatus = (id, status, queue) => api.patch(`/printers/${id}`, { status, queue });

export default api;
