const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");
const { HttpError } = require("../../helpers");
const { schemaAdd, schemaUpd } = require("../../schema/schema");

const router = express.Router();

/**
 * Retrieves the list of all contacts.
 *
 * @route GET /api/contacts
 * @throws {Error} - Throws an HTTP error with a 500 status code if there is a server error.
 * @returns {Array} - An array of contact objects.
 */
router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  res.json(contacts);
});

/**
 * Retrieves a contact by its unique identifier (ID).
 *
 * @route GET /api/contacts/:contactId
 * @param {string} req.params.contactId.path.required - The unique identifier of the contact to retrieve.
 * @throws {HttpError} - Throws an HTTP error with a 404 status code if the contact is not found.
 * @returns {Object|null} - An object representing the retrieved contact or null if not found.
 */
router.get("/:contactId", async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const contact = await getContactById(contactId);

    if (!contact) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
});

/**
 * Creates a new contact and adds it to the list of contacts.
 *
 * @route POST /api/contacts
 * @param {object} req.body.required - The contact object with properties (name, email, phone).
 * @throws {HttpError} - Throws an HTTP error with a 400 status code if the request body is invalid.
 * @returns {object} - Returns an object with the newly created contact
 */
router.post("/", async (req, res, next) => {
  try {
    const { error } = schemaAdd.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }

    const contact = await addContact(req.body);

    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
});

/**
 * Deletes a contact by its unique identifier (ID).
 *
 * @route DELETE /api/contacts/:contactId
 * @param {string} req.params.contactId.path.required - The unique identifier of the contact to delete.
 * @throws {HttpError} - Throws an HTTP error with a 404 status code if the contact is not found.
 * @returns {object} - An object with a success message if the contact is successfully deleted.
 */
router.delete("/:contactId", async (req, res, next) => {
  const contactId = req.params.contactId;

  try {
    const result = await removeContact(contactId);

    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Updates the information of a contact with the specified identifier.
 *
 * @route PUT /api/contacts/:contactId
 * @param {string} req.params.contactId.path.required - The unique identifier of the contact to update.
 * @param {object} req.body.body.required - An object containing the new data to update the contact with.
 *                                        (Must accept at least one parameter)
 * @throws {HttpError} - Throws an HTTP error with a 400 status code if the request body is invalid.
 *                      Throws an HTTP error with a 404 status code if the contact is not found.
 * @returns {object} - An object representing the updated contact information.
 */
router.put("/:contactId", async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      throw HttpError(400, "No update data provided");
    }
    
    const { error } = schemaUpd.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }

    const { contactId } = req.params;

    const contact = await updateContact(contactId, req.body);

    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
