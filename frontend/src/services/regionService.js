import api from "./api";

export const getRegions = (params) => api.get("/region", { params });
export const createRegion = (data) => api.post("/region", data);
export const updateRegion = (id, data) => api.put(`/region/${id}`, data);
export const updateRegionStatus = (id, isActive) =>
  api.patch(`/region/${id}/status`, { isActive });
export const deleteRegion = (id) => api.delete(`/region/${id}`);
