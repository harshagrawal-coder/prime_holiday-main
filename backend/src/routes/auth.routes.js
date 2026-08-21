import { Router } from "express";
import {
  register,
  login,
  GetUser,
  updateUserProfile,
  logoutUser,
  getUsers,
  getUserCount,
} from "../controller/auth.controller.js";
import { authenticate, isAdmin } from "../middleware/auth.middleware.js";
import {
  validateRegisterUser,
  validateLoginUser,
  validateUpdateProfile,
} from "../validators/authvalidators.js";
const authRouter = Router();
authRouter.post("/register", validateRegisterUser, register);
authRouter.post("/login", login);
authRouter.get("/me", authenticate, GetUser);
authRouter.put(
  "/update-profile",
  authenticate,
  validateUpdateProfile,
  updateUserProfile,
);
authRouter.post("/logout", authenticate, logoutUser);
authRouter.get("/get-userCount", authenticate, isAdmin, getUsers);
authRouter.get("/user-count", authenticate, isAdmin, getUserCount);
export default authRouter;
