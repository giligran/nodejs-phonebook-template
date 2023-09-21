const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const path = require("path");

// Define the file path for storing contacts data.
const filePath = path.join(__dirname, "/contacts.json");

/**
 * Retrieve the list of contacts from the JSON file.
 * @returns {Promise<Array>} A Promise that resolves to an array of contacts.
 */
const listContacts = async () => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    const contacts = JSON.parse(data);
    return contacts;
  } catch (error) {
    console.error(error);
    console.warn("An error occurred while reading contacts data.");
  }
};

/**
 * Get a contact by its unique identifier (ID).
 * @param {string} contactId - The ID of the contact to retrieve.
 * @returns {Promise<Object|null>} A Promise that resolves to the retrieved contact or null if not found.
 */
const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((item) => item.id === contactId);
    return contact || null;
  } catch (e) {
    console.error(e);
    console.warn(`Contact with ID ${contactId} not found.`);
  }
};

/**
 * Remove a contact by its unique identifier (ID).
 * @param {string} contactId - The ID of the contact to remove.
 * @returns {Promise<Object|null>} A Promise that resolves to the removed contact or null if not found.
 */
const removeContact = async (contactId) => {
  try {
    const data = await listContacts();

    const contactToDelete = data.find((item) => item.id === contactId);
    if (!contactToDelete) {
      return null;
    }

    const updateContacts = data.filter((item) => item.id !== contactId);

    await fs.writeFile(filePath, JSON.stringify(updateContacts, null, "\t"));

    return contactToDelete;
  } catch (e) {
    console.error(e);
    console.warn(
      `Contact with ID ${contactId} not found. No changes were made.`
    );
  }
};

/**
 * Add a new contact to the list of contacts.
 * @param {Object} contact - The contact object with properties (name, email, phone).
 * @returns {Promise<Object|null>} A Promise that resolves to the added contact or null if there was an error.
 */
const addContact = async (contact) => {
  const newContact = {
    id: nanoid(),
    ...contact,
  };
  try {
    const data = await listContacts();
    if (!data) {
      throw new Error(`Помилка при спробі отримати контакти`);
    }
    const updateData = [...data, newContact];
    await fs.writeFile(filePath, JSON.stringify(updateData, null, "\t"));
    return newContact;
  } catch (e) {
    console.error(e);
  }
};

/**
 * Updates the information of a contact with the specified identifier.
 *
 * @param {string} contactId - The unique identifier of the contact to update.
 * @param {object} data - An object containing the new data to update the contact with.
 *                       (Must accept at least one parameter)
 * @returns {Promise<Object|null>} - Returns the updated contact information as an object
 *                                  or null if the contact is not found.
 * @throws {Error} - Throws an error if there is an issue with reading/writing to the file
 *                  or any other error.
 */
const updateContact = async (contactId, data) => {
  const contacts = await listContacts();

  const contact = contacts.find((contact) => contact.id === contactId);

  if (!contact) {
    return null;
  }

  const updatedContact = {
    ...contact,
    ...data,
  };

  contacts[contacts.indexOf(contact)] = updatedContact;

  await fs.writeFile(filePath, JSON.stringify(contacts, null, 2));

  return updatedContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
