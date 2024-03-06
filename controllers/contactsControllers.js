import contactsService from "../services/contactsServices.js";
import {
    createContactSchema,
    updateContactSchema,
} from "../schemas/contactsSchemas.js";
import { validateBody } from '../helpers/validateBody.js';

export const getAllContacts = async (req, res) => {
    const contacts = await contactsService.listContacts();
    res.json({
        status: 'success',
        code: 200,
        data: {
            contacts,
        }
    })
};

export const getOneContact = async (req, res) => {
    const contactId = req.params.id;
    const contact = await contactsService.getContactById(contactId);
    if (contact) {
        res.json({
            status: 'success',
            code: 200,
            data: {
                contact,
            }
        })
    } else {
        res.status(404).json({
            status: 'error',
            code: 404,
            message: 'Contact not found',
        })
    }
};

export const deleteContact = async (req, res) => {
    const contactId = req.params.id;
    const deletedContact = await contactsService.removeContact(contactId);
    if (deletedContact) {
        res.json({
            status: 'success',
            code: 200,
            data: {
                deletedContact,
            }
        })
    } else {
        res.status(404).json({
            status: 'error',
            code: 404,
            message: 'Not found',
        })
    }
};

export const createContact = async (req, res) => {
    try {
        // const { error, value } = createContactSchema.validate(req.body);
        // if (error) {
        //     return res.status(400).json({ message: error.message });
        // }
        await validateBody(createContactSchema)(req, res, async () => {
            const { name, email, phone } = req.body;
            const newContact = await contactsService.addContact(
                    name,
                    email,
                    phone
                );
            res.status(201).json({
                status: "success",
                code: 201,
                data: {
                    contact: newContact,
                },
            });
        })
        
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({
            status: 'error',
            code: 500,
            message: "internal Server Error",
        })
    }
};

export const updateContact = async (req, res) => {
    try {
        const contactId = req.params.id;
        const updatedData = req.body;
        await validateBody(updateContactSchema)(req, res, async () => {
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
            status: 'error',
            code: 500,
            message: 'Internal Server Error'
        });
    }
};
