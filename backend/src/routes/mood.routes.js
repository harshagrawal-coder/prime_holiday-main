import { Router } from "express";
import { authenticate, isAdmin } from "../middleware/auth.middleware.js";
import {
  createMood,
  getAllMood,
  getMoodById,
  updateMood,
  deleteMood,
  updateMoodStatus,
} from "../controller/mood.controller.js";
import { moodValidator } from "../validators/region.valdators.js";
import { upload } from "../services/multer.js";
const moodRouter = Router();
moodRouter.post("/", authenticate, isAdmin, upload.single("image"), moodValidator, createMood);
moodRouter.get("/", getAllMood);
moodRouter.get("/:id", getMoodById);
moodRouter.put("/:id", authenticate, isAdmin, upload.single("image"), moodValidator, updateMood);
moodRouter.patch("/:id/status", authenticate, isAdmin, updateMoodStatus);
moodRouter.delete("/:id", authenticate, isAdmin, deleteMood);
export default moodRouter;
