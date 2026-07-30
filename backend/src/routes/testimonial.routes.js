import { Router } from "express";
import { authenticate, isAdmin } from "../middleware/auth.middleware.js";
import {
  createTestimonial,
  getTestimonials,
  getAdminTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  updateTestimonialStatus,
} from "../controller/testimonial.controller.js";
import { testimonialValidator } from "../validators/testimonial.validator.js";
import { upload } from "../services/multer.js";
const testimonialRouter = Router();

testimonialRouter.post("/", authenticate, isAdmin, upload.single("image"), testimonialValidator, createTestimonial);
testimonialRouter.get("/admin/all", authenticate, isAdmin, getAdminTestimonials);
testimonialRouter.get("/", getTestimonials);
testimonialRouter.get("/:id", getTestimonialById);
testimonialRouter.put("/:id", authenticate, isAdmin, upload.single("image"), testimonialValidator, updateTestimonial);
testimonialRouter.patch("/:id/status", authenticate, isAdmin, updateTestimonialStatus);
testimonialRouter.delete("/:id", authenticate, isAdmin, deleteTestimonial);

export default testimonialRouter;
