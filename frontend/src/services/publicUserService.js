import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getUserProfile = async (username) => {
    const res = await axios.get(`${API}/publicUsers/${encodeURIComponent(username)}`);
    return res.data.user;
}

export const getUserBooks = async (username) => {
    const res = await axios.get(`${API}/publicUsers/${encodeURIComponent(username)}/books`);
    return res.data.books;
}

export const getUserStats = async (username) => {
    const res = await axios.get(`${API}/publicUsers/${encodeURIComponent(username)}/stats`);
    return res.data;
}

export const getUserReviews = async (username) => {
    const res = await axios.get(`${API}/publicUsers/${encodeURIComponent(username)}/reviews`);
    return res.data.reviews;
}

export const searchUsers = async (query) => {
  const res = await axios.get(`${API}/publicUsers/search`, {
    params: { q: query }
  });
  return res.data;
};
