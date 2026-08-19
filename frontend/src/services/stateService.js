import api from "./api";

export const getStates = (params) => api.get("/state", { params });
export const createState = (data) => api.post("/state", data);
export const updateState = (id, data) => api.put(`/state/${id}`, data);
export const updateStateStatus = (id, isActive) =>
  api.patch(`/state/${id}/status`, { isActive });
export const deleteState = (id) => api.delete(`/state/${id}`);
