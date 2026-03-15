import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_BASE, timeout: 60000 });

export const analyzePosting = async ({ type, content, userId }) => {
  const { data } = await api.post('/analyze', { type, content, userId });
  return data;
};

export const getHistory = async (userId) => {
  const { data } = await api.get(`/analyze/history/${userId}`);
  return data.history;
};

export const deleteHistoryItem = async (id, userId) => {
  const { data } = await api.delete(`/analyze/history/${id}`, {
    params: { userId }
  });
  return data;
};