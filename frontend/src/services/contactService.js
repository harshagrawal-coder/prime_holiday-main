import api from "./api";

export const submitContactForm = (data) => api.post("/contact", data);
export const getAdminContacts = (params) => api.get("/contact", { params });
export const getContactById = (id) => api.get(`/contact/${id}`);
export const updateContactStatus = (id, status) =>
  api.patch(`/contact/${id}/status`, { status });
export const deleteContact = (id) => api.delete(`/contact/${id}`);