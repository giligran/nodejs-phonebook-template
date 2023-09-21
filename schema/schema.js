const Joi = require("joi");

const schemaAdd = Joi.object({
  name: Joi.string().alphanum().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

const schemaUpd = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  number: Joi.string(),
}).xor("name", "email", "number");

module.exports = {
  schemaAdd,
  schemaUpd,
};
