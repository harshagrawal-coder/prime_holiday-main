import api from "./api";

export const getBlogCategories = (params) => api.get("/blogCategory", { params });
export const getAdminBlogCategories = (params) =>
  api.get("/blogCategory/admin/all", { params });
export const createBlogCategory = (data) => api.post("/blogCategory", data);
export const updateBlogCategory = (id, data) =>
  api.put(`/blogCategory/${id}`, data);
export const deleteBlogCategory = (id) => api.delete(`/blogCategory/${id}`);
