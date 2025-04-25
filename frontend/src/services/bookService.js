import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const authHeaders = () => {
    const token = localStorage.getItem('token');
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
// export const debugCreateBook = async (bookData) => {
//     const res = await axios.post(`${API}/books/debug`, bookData, authHeaders());
//     return res.data;
//   };
  