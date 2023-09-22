const Joi = require("joi");

const schemaAdd = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

const schemaUpd = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
});

module.exports = {
  schemaAdd,
  schemaUpd,
};
