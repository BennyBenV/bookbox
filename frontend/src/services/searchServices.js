import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export const searchBooks = async (query) => {
    const res = await axios.get(`https://openlibrary.org/search.json?q=${query}`);
    return res.data.docs;
}

// services/searchServices.js

export const getDiscoverBooks = async () => {
    const keywords = ["love", "magic", "adventure", "story", "life"];
    const random = keywords[Math.floor(Math.random() * keywords.length)];
    const controller = new AbortController();

    const timeout = setTimeout(() => controller.abort(), 1500);  // abort after 1.5s

    try {
        const res = await fetch(`https://openlibrary.org/search.json?q=${random}&limit=10`, {
            signal: controller.signal,
        });
        const data = await res.json();

        return data.docs
            .filter(b => b.cover_i && b.title && b.author_name && b.key)
            .slice(0, 6)
            .map(book => ({
                title: book.title,
                author: book.author_name[0],
                coverId: book.cover_i,
                olid: book.key.replace("/works/", ""),
            }));
    } catch (error) {
        console.warn("getDiscoverBooks failed or timeout:", error);
        return []; // fallback empty list or use cache
    } finally {
        clearTimeout(timeout);
    }
};
