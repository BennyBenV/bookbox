import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const authHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("No token found — unauthorized");
    }

    return{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

}

export const getBooks = async () => {
    const res = await axios.get(`${API}/books`, authHeaders());
    return res.data;
};

export const createBook = async (book) => {
    const res = await axios.post(`${API}/books`, book, authHeaders());
    return res.data;
}

export const deleteBook = async (id) => {
    const res = await axios.delete(`${API}/books/${id}`, authHeaders());
    return res.data;
}

export const getBookById = async (id) => {
    const res = await axios.get(`${API}/books/${id}`, authHeaders());
    return res.data;
}

export const updateBook = async (id, book) => {
    const res = await axios.put(`${API}/books/${id}`, book, authHeaders());
    return res.data;
}

export const getStats = async () => {
    const res = await axios.get(`${API}/books/stats`, authHeaders());
    return res.data;
}

export const getEditionInfo = async (olid) => {
    const res = await axios.get(`https://openlibrary.org/works/${olid}/editions.json?limit=1`);
    const entry = res.data.entries?.[0];
    return{
        publishDate: entry.publish_date || null,
        publisher: entry.publishers?.[0] || null
    }
}

export const getTrending = async () => {
    const res = await axios.get(`${API}/books/trending`);
    return res.data;
}

// export const debugCreateBook = async (bookData) => {
//     const res = await axios.post(`${API}/books/debug`, bookData, authHeaders());
//     return res.data;
//   };
  