import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000, // 30 sec — AI calls can take time
});

export const analyzePosting = async ({ type, content, userId }) => {
  const { data } = await api.post('/analyze', { type, content, userId });
  return data;
};

export const getHistory = async (userId) => {
  const { data } = await api.get(`/analyze/history/${userId}`);
  return data.history;
};

export const getSharedResult = async (shareId) => {
  const { data } = await api.get(`/analyze/share/${shareId}`);
  return data;
};