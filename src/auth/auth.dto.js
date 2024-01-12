const Joi = require("joi");

exports.registerbyPhone = Joi.object({
  phone: Joi.string().required().min(10).max(14),
});
