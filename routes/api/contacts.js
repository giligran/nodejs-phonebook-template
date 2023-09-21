const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
} = require("../../models/contacts");
const { HttpError } = require("../../helpers");
const schema = require("../../schema/schema");

const router = express.Router();

/**
 * Отримати список всіх контактів.
 * @route GET /contacts
 * @returns {Object[]} - Масив контактів.
 * @throws {Error} - Помилка сервера, якщо щось пішло не так при отриманні списку контактів.
 */
router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  res.json(contacts);
});

/**
 * Отримати контакт за його унікальним ідентифікатором.
 * @route GET /contacts/:contactId
 * @param {string} contactId.path.required - Унікальний ідентифікатор контакту.
 * @returns {Object|null} - Об'єкт контакту або null, якщо контакт не знайдено.
 * @throws {Error} - Помилка сервера, якщо щось пішло не так при пошуку контакту.
 */
router.get("/:contactId", async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const contact = await getContactById(contactId);

    if (contact === null) {
      res.status(404).json({ message: "Not found" });
    } else {
      res.json(contact);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }

    const result = await addContact(req.body);

    res.status(201).json(result);
  } catch (error) {
    console.error(error);

    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Помилка сервера" });
    }
  }
});

router.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
