const Joi = require('joi').extend(require('@joi/date'));
const Response = require('../response/default');

async function validateTransactionHotel(req, res, next) {
  const payload = req.body || req.query || req.params;
  const schema = Joi.object({
    total_transaction: Joi.number(),
    transactions: Joi.array().items(Joi.object({
      token: Joi.string(),
      hotel_code: Joi.string(),
      member_phone: Joi.any(),
      user: Joi.string(),
      store: Joi.number(),
      invoice_number: Joi.string(),
      total_value: Joi.number(),
      number_of_people: Joi.number(),
      tax: Joi.number(),
      service: Joi.number(),
      discount: Joi.number(),
      created_at: Joi.date().format(['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD']),
      check_in_at: Joi.date().format(['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD']),
      check_out_at: Joi.date().format(['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD']),
      items: Joi.array().items(Joi.object({
        product_name: Joi.string(),
        quantity: Joi.number(),
        price: Joi.number(),
        ratecode: Joi.string(),
        roomtype: Joi.string(),
      })),
      vouchers: Joi.array().items(Joi.object({
        voucher_code: Joi.string(),
      })),
      benefits: Joi.array().items(Joi.object({
        benefit_id: Joi.string(),
      })),
    })),

  });

  const {error} = schema.validate(payload, {allowUnknown: false, abortEarly: false});

  if (error) {
    return Response.make(res).sendInvalidData(error);
  }

  return next();
}

async function validateTransactionOutlet(req, res, next) {
  const payload = req.body || req.query || req.params;
  const schema = Joi.object({
    total_transaction: Joi.number(),
    transactions: Joi.array().items(Joi.object({
      licence_id: Joi.string(),
      user: Joi.string(),
      member_phone: Joi.any(),
      store_id: Joi.number(),
      invoice_number: Joi.string(),
      table_number: Joi.string(),
      open_table_at: Joi.date(),
      cloesed_table_at: Joi.date(),
      total_value: Joi.number(),
      number_of_people: Joi.number(),
      tax: Joi.number(),
      service: Joi.number(),
      discount: Joi.number(),
      created: Joi.date(),
      items: Joi.array().items(Joi.object({
        product_name: Joi.string(),
        quantity: Joi.number(),
        price: Joi.number(),
        ratecode: Joi.string(),
        roomtype: Joi.string(),
      })),
      vouchers: Joi.array().items(Joi.object({
        voucher_code: Joi.string(),
      })),
      benefits: Joi.array().items(Joi.object({
        benefit_id: Joi.string(),
      })),
    })),
  });

  const {error} = schema.validate(payload, {allowUnknown: false, abortEarly: false});

  if (error) {
    return Response.make(res).sendInvalidData(error);
  }

  return next();
}

module.exports = {
  validateTransactionHotel,
  validateTransactionOutlet,
};
