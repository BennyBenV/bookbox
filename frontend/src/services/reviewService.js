import axios from "axios";

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

export const getAverageRating = async (olid) => {
    const res = await axios.get(`${API}/reviews/${olid}/average`);
    return res.data;
}

export const getPublicReviews = async (olid) => {
    const res = await axios.get(`${API}/reviews/${olid}`);
    return res.data
}

export const createOrUpdateReview = async ({ olid, rating, review }) => {
    const res = await axios.post(`${API}/reviews`,{ olid, rating, review },authHeaders());
    return res.data;
  };
  
