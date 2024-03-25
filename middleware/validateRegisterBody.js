import { registerSchema } from "../schemas/schemas.js"

export const validateRegisterBody = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res
            .status(400)
            .json({ message: error.message });
    }
    next();
};