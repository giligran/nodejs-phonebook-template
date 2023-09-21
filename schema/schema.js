const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().alphanum().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

module.exports = schema;
