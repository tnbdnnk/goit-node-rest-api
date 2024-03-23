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
import { handleInvalidId } from "../middleware/idValidationMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authMiddleware, (req, res, next) => {
    if (req.query.page && req.query.limit) {
        return getContactsPaginated(req, res, next);
    } else {
        return getAllContacts(req, res, next);
    }
});

// contactsRouter.get("/", authMiddleware, getAllContacts);
contactsRouter.get("/:id", handleInvalidId, getOneContact);
contactsRouter.delete("/:id", handleInvalidId, deleteContact);
contactsRouter.post("/", authMiddleware, createContact);
contactsRouter.put("/:id", handleInvalidId, updateContact);
contactsRouter.patch("/:id/favorite", handleInvalidId, updateStatusContact);
contactsRouter.get("/favorite", authMiddleware, getFavoriteContacts);
// contactsRouter.get("/", authMiddleware, getContactsPaginated);

export default contactsRouter;
