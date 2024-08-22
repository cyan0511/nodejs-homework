import path from 'path';
import fs from 'fs/promises';
import { nanoid } from 'nanoid';

const contactsPath = path.join("./models/", "contacts.json");

const listContacts = async () => {
  try {
    const contacts = await fs.readFile(contactsPath);
    return JSON.parse(contacts);
  } catch (error) {
    console.error("Error reading contacts:", error.message);
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const contact = contacts.find(contact => contact.id === contactId);
    return contact || null;
  } catch (error) {
    console.error("Error reading contacts by id:", error.message);
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);
    if (index === -1) {
      return null;
    }
    const deletedContact = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return deletedContact;
  } catch (error) {
    console.error("Error removing contact:", error.message);
  }
};

const addContact = async ({ name, email, phone }) => {
  try {
    const newContact = {
      id: nanoid(),
      name,
      email,
      phone,
    };

    const contacts = await listContacts();

    const allContacts = [...contacts, newContact];
    await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
    return newContact;
  } catch (error) {
    console.error("Error adding new contact:", error);
  }
};

const updateContact = async ({ id, name, email, phone }) => {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === id);
    if (index === -1) {
      return null;
    }

    contacts[index] = { ...contacts[index], name, email, phone };

    // Write the updated contacts
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    // Respond with the updated contact
    return contacts[index];
  } catch (error) {
    console.error("Error updating contact:", error);
  }
};

export { listContacts, getContactById, removeContact, addContact, updateContact };