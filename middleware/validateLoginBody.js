import { loginSchema } from "../schemas/schemas.js";

export const validateLoginBody = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.message });
    }
    next();
}