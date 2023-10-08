const { Contact } = require("../models/contact");
const { HttpError } = require("../helpers");
const ctrlWrapper = require("../helpers/ctrlWrapper");

/**
 * Retrieves the list of all contacts.
 *
 * @route GET /api/contacts
 * @throws {Error} - Throws an HTTP error with a 500 status code if there is a server error.
 * @returns {Array} - An array of contact objects.
 */
const getAll = async (req, res) => {
  const contacts = await Contact.find();
  res.status(200).json(contacts);
};

/**
 * Retrieves a contact by its unique identifier (ID).
 *
 * @route GET /api/contacts/:contactId
 * @param {string} req.params.contactId.path.required - The unique identifier of the contact to retrieve.
 * @throws {HttpError} - Throws an HTTP error with a 404 status code if the contact is not found.
 * @returns {Object|null} - An object representing the retrieved contact or null if not found.
 */
const getById = async (req, res) => {
  const contactId = req.params.contactId;
  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(contact);
};

/**
 * Creates a new contact and adds it to the list of contacts.
 *
 * @route POST /api/contacts
 * @param {object} req.body.required - The contact object with properties (name, email, phone).
 * @throws {HttpError} - Throws an HTTP error with a 400 status code if the request body is invalid.
 * @returns {object} - Returns an object with the newly created contact
 */
const add = async (req, res) => {
  const contact = await Contact.create(req.body);

  res.status(201).json(contact);
};

/**
 * Deletes a contact by its unique identifier (ID).
 *
 * @route DELETE /api/contacts/:contactId
 * @param {string} req.params.contactId.path.required - The unique identifier of the contact to delete.
 * @throws {HttpError} - Throws an HTTP error with a 404 status code if the contact is not found.
 * @returns {object} - An object with a success message if the contact is successfully deleted.
 */
const remove = async (req, res) => {
  const contactId = req.params.contactId;
  const result = await Contact.findByIdAndDelete(contactId);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({ message: "contact deleted" });
};

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
const updateById = async (req, res) => {
  const { contactId } = req.params;

  const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!contact) {
    throw HttpError(404, "Not found");
  }
  res.json(contact);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.status(200).json(result);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  remove: ctrlWrapper(remove),
  updateById: ctrlWrapper(updateById),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
