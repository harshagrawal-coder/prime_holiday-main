import api from "./api";

export const getBlogs = (params) => api.get("/blog", { params });
export const getBlogBySlug = (slug) => api.get(`/blog/slug/${slug}`);
export const getBlogById = (id) => api.get(`/blog/${id}`);
export const getAdminBlogs = (params) => api.get("/blog/admin/all", { params });
export const createBlog = (data) => api.post("/blog", data);
export const updateBlog = (id, data) => api.put(`/blog/${id}`, data);
export const deleteBlog = (id) => api.delete(`/blog/${id}`);
