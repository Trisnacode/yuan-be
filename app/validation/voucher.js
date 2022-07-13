const Joi = require('joi').extend(require('@joi/date'));
const Response = require('../response/default');

async function validateId(req, res, next) {
  const payload = req.body || req.query || req.params;
  const schema = Joi.object({
    id: Joi.any(),
  });

  const {error} = schema.validate(payload, {allowUnknown: true, abortEarly: false});

  if (error) {
    return Response.make(res).sendInvalidData(error);
  }

  return next();
}

async function validateInsert(req, res, next) {
  const payload = req.body || req.query || req.params;
  const schema = Joi.object({
    code: Joi.string(),
    title: Joi.string().required(),
    description: Joi.string(),
    tnc: Joi.string(),
    image: Joi.string().base64(),

    required_point: Joi.number(),
    discount_amount: Joi.number(),
    discount_percent: Joi.number(),
    minimum_spending: Joi.number().required().default(0),

    quantity: Joi.number(),

    expired_at: Joi.date().format('YYYY-MM-DD'),
    is_active: Joi.boolean().default(true),
    is_buyable: Joi.boolean(),

  });

  const {error} = schema.validate(payload, {allowUnknown: false, abortEarly: false});

  if (error) {
    return Response.make(res).sendInvalidData(error);
  }

  return next();
}


async function validateUpdate(req, res, next) {
  const payload = req.body || req.query || req.params;
  const schema = Joi.object({
    id: Joi.any().required(),
    code: Joi.string(),
    title: Joi.string(),
    description: Joi.string(),
    tnc: Joi.string(),
    image: Joi.string().base64(),

    required_point: Joi.number(),
    discount_amount: Joi.number(),
    discount_percent: Joi.number(),
    minimum_spending: Joi.number(),

    quantity: Joi.number(),

    expired_at: Joi.date().format('YYYY-MM-DD'),
    is_active: Joi.boolean().default(true),
    is_buyable: Joi.boolean(),

  });

  const {error} = schema.validate(payload, {allowUnknown: false, abortEarly: false});

  if (error) {
    return Response.make(res).sendInvalidData(error);
  }

  return next();
}

async function validateGift(req, res, next) {
  const payload = req.body || req.query || req.params;
  const schema = Joi.object({
    member_id: Joi.number().required(),
    voucher_id: Joi.number().required(),
    expired_at: Joi.date().format('YYYY-MM-DD'),
    is_active: Joi.boolean().default(true),
  });

  const {error} = schema.validate(payload, {allowUnknown: false, abortEarly: false});

  if (error) {
    return Response.make(res).sendInvalidData(error);
  }

  return next();
}

async function validateBurn(req, res, next) {
  const payload = req.body || req.query || req.params;
  const schema = Joi.object({
    outlet_code: Joi.any(),
    // license_id: Joi.any(),
    cashier_id: Joi.any(),
    cashier_name: Joi.any(),
    member_id: Joi.any(),
    member_phone: Joi.any(),
    vouchers: Joi.array().items(Joi.object({
      voucher_code: Joi.any().required(),
    })).required(),
  });

  const {error} = schema.validate(payload, {allowUnknown: false, abortEarly: false});

  if (error) {
    return Response.make(res).sendInvalidData(error);
  }

  return next();
}

async function validateUnburn(req, res, next) {
  const payload = req.body || req.query || req.params;
  const schema = Joi.object({
    member_id: Joi.number(),
    member_phone: Joi.any(),
    vouchers: Joi.array().items(Joi.object({
      voucher_code: Joi.any().required(),
    })).required(),
  });

  const {error} = schema.validate(payload, {allowUnknown: false, abortEarly: false});

  if (error) {
    return Response.make(res).sendInvalidData(error);
  }

  return next();
}

async function validateBuy(req, res, next) {
  const payload = req.body || req.query || req.params;
  const schema = Joi.object({
    member_id: Joi.number(),
    voucher_id: Joi.number().required(),
  });

  const {error} = schema.validate(payload, {allowUnknown: false, abortEarly: false});

  if (error) {
    return Response.make(res).sendInvalidData(error);
  }

  return next();
}


module.exports = {
  validateInsert,
  validateUpdate,
  validateBurn,
  validateUnburn,
  validateId,
  validateGift,
  validateBuy,
};
