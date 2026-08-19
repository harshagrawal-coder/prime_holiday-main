import api from "./api";

export const getGallery = (params) => api.get("/gallery", { params });
export const getAdminGallery = (params) => api.get("/gallery/admin/all", { params });
export const createGallery = (data) => api.post("/gallery", data);
export const updateGallery = (id, data) => api.put(`/gallery/${id}`, data);
export const deleteGallery = (id) => api.delete(`/gallery/${id}`);
