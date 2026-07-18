import { Router } from "express";
import { authenticate, isAdmin } from "../middleware/auth.middleware.js";
import { upload } from "../services/multer.js";

import { createBlog, getAdminBlogs, getBlogById, updateBlog, deleteBlog, getBlogBySlug, getBlogs } from "../controller/Blog.controller.js";
const blogRouter = Router()
blogRouter.post("/", authenticate, isAdmin, createBlog)
blogRouter.get("/", authenticate, getBlogs)
blogRouter.get("/admin/all", authenticate, isAdmin,getAdminBlogs)
blogRouter.get(
    "/:id",
    authenticate,
    isAdmin,
    getBlogById
);
blogRouter.get("/slug/:slug", authenticate, getBlogBySlug)
blogRouter.put("/:id", authenticate, isAdmin, updateBlog)
blogRouter.delete("/:id", authenticate, isAdmin, deleteBlog)

export default blogRouter
