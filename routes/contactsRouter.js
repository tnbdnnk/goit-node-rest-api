import express from "express";
import {
    getAllContacts,
    getOneContact,
    deleteContact,
    createContact,
    updateContact,
    updateStatusContact
} from "../controllers/contactsControllers.js";
import { handleInvalidId } from "../middleware/validationMiddleware.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);
contactsRouter.get("/:id", handleInvalidId, getOneContact);
contactsRouter.delete("/:id", handleInvalidId, deleteContact);
contactsRouter.post("/", createContact);
contactsRouter.put("/:id", handleInvalidId, updateContact);
contactsRouter.patch("/:id/favorite", handleInvalidId, updateStatusContact);

export default contactsRouter;
