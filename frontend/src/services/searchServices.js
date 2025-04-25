import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export const searchBooks = async (query) => {
    const res = await axios.get(`${API}/search?q=${encodeURIComponent(query)}`);
    return res.data;
}