import { verifyEmailValidationSchema } from "../schemas/schemas.js";

export const verifyEmailValidation = async (req, res, next) => {
    const { error } = verifyEmailValidationSchema.validate(req.body);
    if (error) {
        return res
            .status(400)
            .json({ message: error.message });
    }
    next();
}