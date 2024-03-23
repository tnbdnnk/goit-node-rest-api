import { registerSchema } from "../schemas/schemas.js"

export const validateRegisterBody = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        console.error('validation error', error)
        return res
            .status(400)
            .json({ message: "Помилка від Joi або іншої бібліотеки валідації" });
    }
    next();
};