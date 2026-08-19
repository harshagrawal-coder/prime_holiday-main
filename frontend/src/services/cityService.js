import api from "./api";

export const getCities = (params) => api.get("/city", { params });
export const createCity = (data) => api.post("/city", data);
export const updateCity = (id, data) => api.put(`/city/${id}`, data);
export const updateCityStatus = (id, isActive) =>
  api.patch(`/city/${id}/status`, { isActive });
export const deleteCity = (id) => api.delete(`/city/${id}`);
