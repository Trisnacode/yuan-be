const Joi = require('joi').extend(require('@joi/date'));
const Response = require('../response/default');


async function validateRegister(req, res, next) {
  const payload = req.body || req.query || req.params;
  const schema = Joi.object({
    title: Joi.string(),
    name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    gender: Joi.string().valid('MALE', 'FEMALE'),
    address: Joi.string(),
    country: Joi.string(),
    city: Joi.string(),
    birth_date: Joi.date().format('YYYY-MM-DD'),
  });

  const {error} = schema.validate(payload, {allowUnknown: false, abortEarly: false});

  if (error) {
    return Response.make(res).sendInvalidData(error);
  }

  return next();
}

async function validateLogin(req, res, next) {
  const payload = req.body || req.query || req.params;
  const schema = Joi.object({
    method: Joi.string().valid('EMAIL', 'PHONE').required(),
    email: Joi.alternatives().conditional('method', {is: 'EMAIL', then: Joi.string().email().required(), otherwise: Joi.any().strip()}),
    phone: Joi.alternatives().conditional('method', {is: 'PHONE', then: Joi.string().required(), otherwise: Joi.any().strip()}),
    password: Joi.string().required(),
  });

  const {error} = schema.validate(payload, {allowUnknown: false, abortEarly: false});

  if (error) {
    return Response.make(res).sendInvalidData(error);
  }

  return next();
}

async function validateChange(req, res, next) {
  const payload = req.body || req.query || req.params;
  const schema = Joi.object({
    password_old: Joi.string().required(),
    password_new: Joi.string().required(),
  });

  const {error} = schema.validate(payload, {allowUnknown: false, abortEarly: false});

  if (error) {
    return Response.make(res).sendInvalidData(error);
  }

  return next();
}

async function validateProfile(req, res, next) {
  const payload = req.body || req.query || req.params;
  const schema = Joi.object({
    title: Joi.string(),
    name: Joi.string(),
    gender: Joi.string().valid('MALE', 'FEMALE'),
    address: Joi.string(),
    country: Joi.string(),
    city: Joi.string(),
    birth_date: Joi.date().format('YYYY-MM-DD'),
  });

  const {error} = schema.validate(payload, {allowUnknown: false, abortEarly: false});

  if (error) {
    return Response.make(res).sendInvalidData(error);
  }

  return next();
}


module.exports = {
  validateRegister,
  validateLogin,
  validateChange,
  validateProfile,
};
