import api from "./api";

export const getDurations = (params) => api.get("/duration", { params });
export const createDuration = (data) => api.post("/duration", data);
export const updateDuration = (id, data) => api.put(`/duration/${id}`, data);
export const updateDurationStatus = (id, isActive) =>
  api.patch(`/duration/${id}/status`, { isActive });
export const deleteDuration = (id) => api.delete(`/duration/${id}`);
