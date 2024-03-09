import contactsService from "../services/contactsServices.js";
import {
    createContactSchema,
    updateContactSchema,
} from "../schemas/contactsSchemas.js";
import validateBody from '../helpers/validateBody.js';

export const getAllContacts = async (req, res) => {
    const contacts = await contactsService.listContacts();
    res.status(200).json(contacts)
};

export const getOneContact = async (req, res) => {
    const contactId = req.params.id;
    const contact = await contactsService.getContactById(contactId);
    if (contact) {
        res.status(200).json(contact)
    } else {
        res.status(404).json({
            message: 'Contact not found',
        })
    }
};

export const deleteContact = async (req, res) => {
    const contactId = req.params.id;
    const deletedContact = await contactsService.removeContact(contactId);
    if (deletedContact) {
        res.status(200).json(
            deletedContact
        )
    } else {
        res.status(404).json({
            message: 'Not found',
        })
    }
};


const validateRequiredFields = (fields, body) => {
    const missingFields = [];
    fields.forEach(field => {
        if (!body[field]) {
            missingFields.push(field);
        }
    });
    return missingFields;
};

export const createContact = async (req, res) => {
    try {
        validateBody(createContactSchema)(req, res, async () => {
            const { name, email, phone } = req.body;
            const requiredFields = ['name', 'email', 'phone'];
            const missingFields = validateRequiredFields(requiredFields, req.body);
            if (missingFields.length > 0) {
                const message = `Missing required field(s): ${missingFields.join(', ')}`;
                return res.status(400).json({ message });
            }
            const newContact = await contactsService.addContact(name, email, phone);
            return res.status(201).json(
                newContact,
            );
        });
    } catch (error) {
        console.error('Error creating contact:', error);
        return res.status(error.status || 500).json({ message: error.message || "Internal Server Error" });
    }
};

export const updateContact = async (req, res) => {
    try {
        const contactId = req.params.id;
        const updatedData = req.body;
        validateBody(updateContactSchema)(req, res, async () => {
            if (Object.keys(updatedData).length === 0) {
                return res.status(400).json({ message: 'Body must have at least one field!' });
            };
            const updatedContact = await contactsService.updateContact(contactId, updatedData);
            if (!updatedContact) {
                return res.status(404).json({ message: 'Not found' });
            };
            return res.status(200).json(updatedContact);
        });
    } catch (error) {
        console.error('Error updating contact', error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};
