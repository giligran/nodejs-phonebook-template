const express = require("express");

const ctrl = require("../../controllers/contacts");

const router = express.Router();

router.get("/", ctrl.getAll);

router.get("/:contactId", ctrl.getById);

router.post("/", ctrl.contactAdd);

router.delete("/:contactId", ctrl.deleteContact);

router.put("/:contactId", ctrl.changeContact);

module.exports = router;
