import api from "./api";

export const getHeroImages = (params) => api.get("/herohomepage", { params });
export const getAdminHeroImages = (params) =>
  api.get("/herohomepage/admin/all", { params });
export const createHeroImage = (data) => api.post("/herohomepage", data);
export const updateHeroImage = (id, data) => api.put(`/herohomepage/${id}`, data);
export const deleteHeroImage = (id) => api.delete(`/herohomepage/${id}`);
