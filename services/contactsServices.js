import { promises as fs } from "node:fs";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contactsPath = path.join(__dirname, "../db/contacts.json");

async function listContacts() {
    try {
        const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading contacts:", error);
        throw error;
    }
}

async function getContactById(contactId) {
    const contacts = await listContacts();
    const res = contacts.find(contact => contact.id === contactId);
    return res || null;
}

async function removeContact(contactId) {
    const contacts = await listContacts();
    const result = contacts.findIndex((contact) => contact.id === contactId);
    if (result === -1) {
        return null;
    }
    const deletedContact = contacts[result];
    contacts.splice(result, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2)); 
    return deletedContact;
}

async function addContact(name, email, phone) {
    const contacts = await listContacts();
    const newContact = { id: uuidv4(), name, email, phone };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
}

async function updateContact(contactId, updatedContactData) {
    try {
        const contacts = await listContacts();
        const contactIndex = contacts.findIndex((contact) => contact.id === contactId);
        if (contactIndex === -1) {
            return null;
        };
        contacts[contactIndex] = {
            ...contacts[contactIndex],
            ...updatedContactData
        };
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
        return contacts[contactIndex];
    } catch (error) {
        console.error("Error updating contact:", error);
        throw error;
    }
}

export default { listContacts, addContact, getContactById, removeContact, updateContact };

