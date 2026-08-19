import api from "./api";

export const getTestimonials = (params) => api.get("/testimonial", { params });
export const getAdminTestimonials = (params) =>
  api.get("/testimonial/admin/all", { params });
export const createTestimonial = (data) => api.post("/testimonial", data);
export const updateTestimonial = (id, data) =>
  api.put(`/testimonial/${id}`, data);
export const updateTestimonialStatus = (id, isActive) =>
  api.patch(`/testimonial/${id}/status`, { isActive });
export const deleteTestimonial = (id) => api.delete(`/testimonial/${id}`);
