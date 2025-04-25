import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export const searchBooks = async (query) => {
    const res = await axios.get(`https://openlibrary.org/search.json?q=${query}`);
    return res.data.docs;
}