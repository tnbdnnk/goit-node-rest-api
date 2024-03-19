export const validateRequiredFields = (fields, body) => {
    const missingFields = [];
    fields.forEach(field => {
        if (!body[field]) {
            missingFields.push(field);
        }
    });
    return missingFields;
};