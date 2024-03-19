import { isValidObjectId } from "mongoose";

export const handleInvalidId = (req, res, next) => {
    const contactId = req.params.id;
    if (!isValidObjectId(contactId)) {
        return res.status(400).json({ message: "Invalid ID format." });
    }
    next();
}