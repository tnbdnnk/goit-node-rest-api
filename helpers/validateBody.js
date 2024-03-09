const validateBody = (schema) => {
    const func = (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return res.status(400).json({ message: errorMessage });
        }
        const notValidFields = Object
            .entries(value)
            .filter(([key, val]) => typeof val !== 'string')
            .map(([key]) => key);
        if (notValidFields.length > 0) {
            return res.status(400).json({ message: `${notValidFields.join(', ')} should be a string` });
        }
        next();
    };
    return func;
};

export default validateBody;