import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const authHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Pas de token trouvé");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getMe = async () => {
  const res = await axios.get(`${API}/users/me`, authHeaders());
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await axios.put(`${API}/users/me`, data, authHeaders());
  return res.data;
};

export const deleteAccount = async () => {
  const res = await axios.delete(`${API}/users/me`, authHeaders());
  return res.data;
};

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const token = localStorage.getItem("token");
  if(!token) throw new Error ("Pas de token");

  const res = await axios.post(`${API}/users/avatar`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    }
  })
  return res.data;
}