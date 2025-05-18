import axios from "axios";
const API = import.meta.env.VITE_API_URL;

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const followUser = async (username) => {
  await axios.post(`${API}/follows/${username}/follow`, {}, authHeaders());
};

export const unfollowUser = async (username) => {
  await axios.delete(`${API}/follows/${username}/unfollow`, authHeaders());
};

export const checkFollowStatus = async (username) => {
  const res = await axios.get(`${API}/follows/${username}/status`, authHeaders());
  return res.data;
};

export const getFollowers = async (username) => {
  const res = await axios.get(`${API}/follows/${username}/followers`, authHeaders());
  return res.data.followers;
};

export const getFollowing = async (username) => {
  const res = await axios.get(`${API}/follows/${username}/following`, authHeaders());
  return res.data.following;
};
