import api from "./api";

export const getMoods = (params) => api.get("/mood", { params });
export const createMood = (data) => api.post("/mood", data);
export const updateMood = (id, data) => api.put(`/mood/${id}`, data);
export const updateMoodStatus = (id, isActive) =>
  api.patch(`/mood/${id}/status`, { isActive });
export const deleteMood = (id) => api.delete(`/mood/${id}`);
