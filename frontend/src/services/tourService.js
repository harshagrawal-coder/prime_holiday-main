import api from "./api";

export const getTours = (params) => api.get("/tour", { params });
export const getTourBySlug = (slug) => api.get(`/tour/slug/${slug}`);
export const getTourById = (id) => api.get(`/tour/${id}`);
export const getSimilarTours = (id) => api.get(`/tour/${id}/similar`);
export const getAdminTours = (params) => api.get("/tour/admin/all", { params });
export const createTour = (data) => api.post("/tour", data);
export const updateTour = (id, data) => api.put(`/tour/${id}`, data);
export const deleteTour = (id) => api.delete(`/tour/${id}`);
