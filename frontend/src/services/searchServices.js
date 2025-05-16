import axios from "axios";

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

const cleanGoogleBook = (item) => {
    const info = item.volumeInfo;
    return {
        id: item.id,
        title: info.title,
        author: info.authors?.[0] ?? "Unknown",
        cover: info.imageLinks?.thumbnail ?? null,
        publishedDate: info.publishedDate ?? null,
        description: info.description ?? null,
    };
};

export async function searchBooks(query) {
    try {
        const res = await axios.get(GOOGLE_BOOKS_API, {
            params: { q: query, maxResults: 40 },
        });
        return res.data.items?.map(cleanGoogleBook) ?? [];
    } catch (err) {
        console.error("[searchBooks] failed:", err);
        throw err;
    }
}

export const getDiscoverBooks = async () => {
    const keywords = ["love", "magic", "adventure", "story", "life"];
    const random = keywords[Math.floor(Math.random() * keywords.length)];

    try {
        const res = await axios.get(GOOGLE_BOOKS_API, {
            params: { q: random, maxResults: 10 },
        });

        return res.data.items
            ?.filter(item => item.volumeInfo?.title && item.volumeInfo?.authors)
            .slice(0, 6)
            .map(cleanGoogleBook) ?? [];
    } catch (error) {
        console.warn("[getDiscoverBooks] failed:", error);
        return [];
    }
};
