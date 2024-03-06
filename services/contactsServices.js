const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const contactsPath = path.join(__dirname, "./db/contacts.json");

async function listContacts() {
    const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
    return JSON.parse(data);
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
    const newContact = { id: crypto.randomUUID(), name, email, phone };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
}

module.exports = {  
    listContacts,
    addContact,
    getContactById,
    removeContact,
};