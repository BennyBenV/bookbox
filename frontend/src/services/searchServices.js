import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export async function searchBooks(query) {
    console.time("[searchBooks] API call");
    try {
        const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        console.timeEnd("[searchBooks] API call");
        return data.docs;
    } catch (err) {
        console.error("[searchBooks] failed:", err);
        throw err;
    }
}


// services/searchServices.js

export const getDiscoverBooks = async () => {
    const keywords = ["love", "magic", "adventure", "story", "life"];
    const random = keywords[Math.floor(Math.random() * keywords.length)];
    const controller = new AbortController();

    // const timeout = setTimeout(() => controller.abort(), 1500);  // abort after 1.5s

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
    } 
};
