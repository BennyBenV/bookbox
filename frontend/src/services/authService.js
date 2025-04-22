import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export const registerUser = async (email, password) => {
    const res = await axios.post(`${API}/auth/register`, { email, password });
    return res.data.token;
};

export const loginUser = async (email, password) => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    return res.data.token;
}