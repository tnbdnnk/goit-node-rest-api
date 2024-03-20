import express from "express";
import {
    getAllContacts,
    getOneContact,
    deleteContact,
    createContact,
    updateContact,
    updateStatusContact,
    getFavoriteContacts,
    getContactsPaginated
} from "../controllers/contactsControllers.js";
import { handleInvalidId } from "../middleware/validationMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);
contactsRouter.get("/:id", handleInvalidId, getOneContact);
contactsRouter.delete("/:id", handleInvalidId, deleteContact);
contactsRouter.post("/", createContact);
contactsRouter.put("/:id", handleInvalidId, updateContact);
contactsRouter.patch("/:id/favorite", handleInvalidId, updateStatusContact);
contactsRouter.get("/favorite", authMiddleware, getFavoriteContacts);
contactsRouter.get("/contacts", authMiddleware, getContactsPaginated);

export default contactsRouter;
