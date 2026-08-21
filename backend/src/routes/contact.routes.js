import { Router } from "express";

import {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} from "../controller/contact.controller.js";

import { authenticate, isAdmin } from "../middleware/auth.middleware.js";

import {
  validateCreateContact,
  validateUpdateContactStatus,
} from "../validators/contact.validator.js";

const contactRouter = Router();

contactRouter.post("/", validateCreateContact, createContact);
contactRouter.get("/", authenticate, isAdmin, getAllContacts);
contactRouter.get("/:id", authenticate, isAdmin, getContactById);
contactRouter.patch(
  "/:id/status",
  authenticate,
  isAdmin,
  validateUpdateContactStatus,
  updateContactStatus,
);
contactRouter.delete("/:id", authenticate, isAdmin, deleteContact);

export default contactRouter;
