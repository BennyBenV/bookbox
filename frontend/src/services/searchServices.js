import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export const searchBooks = async (query) => {
    const res = await axios.get(`https://openlibrary.org/search.json?q=${query}`);
    return res.data.docs;
}

export const getDiscoverBooks = async () => {
    const keywords = ["love", "magic", "adventure", "story", "life"];
    const random = keywords[Math.floor(Math.random() * keywords.length)];

    const res = await fetch(`https://openlibrary.org/search.json?q=${random}&limit=20`);
    const data = await res.json();

    return data.docs.filter(b => b.cover_i && b.title && b.author_name && b.key).slice(0,6).map(book => ({title : book.title, author: book.author_name[0], coverId: book.cover_i, olid: book.key.replace("/works/", ""),}))
}