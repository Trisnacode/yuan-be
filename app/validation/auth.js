const Joi = require('joi');

async function validateRegister(payload) {
  const schema = Joi.object({
    title: Joi.string(),
    name: Joi.string(),
    phone: Joi.string().required(),
    email: Joi.string().email(),
    password: Joi.string().required(),
    gender: Joi.string().valid('MALE', 'FEMALE'),
    address: Joi.string(),
    country: Joi.string(),
    city: Joi.string(),
    birth_date: Joi.date(),
  });

  const {error} = schema.validate(payload, {allowUnknown: false, abortEarly: false});

  if (error) {
    return error;
  }

  return true;
}

async function validateLogin(payload) {
  const schema = Joi.object({
    phone: Joi.string().required(),
    password: Joi.string().required(),
  });

  const {error} = schema.validate(payload, {allowUnknown: false, abortEarly: false});

  if (error) {
    return error;
  }

  return true;
}


module.exports = {
  validateRegister,
  validateLogin,
};
