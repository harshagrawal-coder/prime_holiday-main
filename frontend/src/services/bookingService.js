import api from "./api";

export const getAdminBookings = (params) => api.get("/booking", { params });
export const createBooking = (data) => api.post("/booking", data);
export const getBookingById = (id) => api.get(`/booking/${id}`);
export const updateBookingStatus = (id, status) =>
  api.patch(`/booking/${id}/status`, { status });
export const deleteBooking = (id) => api.delete(`/booking/${id}`);