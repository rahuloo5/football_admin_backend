const Joi = require("joi");

const paymentCreateSchema = Joi.object({
  paymentDate: Joi.date().default(new Date()),
  renewalDate: Joi.date().required(),
  amount: Joi.number().required(),
  planId: Joi.string().hex().length(24).required(),
  sessionId: Joi.string(),
  status: Joi.string(),
});
module.exports = paymentCreateSchema;
