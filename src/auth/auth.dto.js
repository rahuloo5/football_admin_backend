const Joi = require("joi");

exports.registerDto = Joi.object({
  phone: Joi.string().required().min(10).max(14),
});

// exports.updateDto = Joi.object({
//   firstName: Joi.string().min(1),
//   lastName: Joi.string().min(1),
//   email: Joi.string().email(),
//   gender: Joi.string(),
//   dob: Joi.string(),
//   profilePicture: Joi.allow(),
//   isOnboardingDone: Joi.boolean(),
//   surgeryDetails: Joi.array().items(
//     Joi.object({
//       surgeryDate: Joi.string(),
//       surgeryLocation: Joi.string(),
//     })
//   ),
//   otherSurgeryDetails: Joi.array().items(
//     Joi.object({
//       surgeryDate: Joi.string(),
//       surgeryLocation: Joi.string(),
//     })
//   ),
//   tobacco: Joi.string(),
// });

exports.resetPasswordDto = Joi.object({
  password: Joi.string()
    .required()
    .min(8)
    .pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[$@$!%*?&#])/),
});
