import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const authHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found — unauthorized");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const getAverageRating = async (id) => {
    const res = await axios.get(`${API}/reviews/${id}/average`);
    return res.data;
};

export const getPublicReviews = async (id) => {
    const res = await axios.get(`${API}/reviews/${id}`);
    return res.data;
};

export const createOrUpdateReview = async ({ googleBookId, rating, review }) => {
    const payload = { googleBookId, rating, review };
    const res = await axios.post(`${API}/reviews`, payload, authHeaders());
    return res.data;
};

export const getUserReview = async (googleBookId) => {
  const res = await axios.get(`${API}/reviews/${googleBookId}/me`, authHeaders());
  return res.data.review;
};

export const updateOnlyReview = async (googleBookId, review) => {
  const res = await axios.patch(`${API}/reviews/${googleBookId}/review`, { review }, authHeaders());
  return res.data;
};
