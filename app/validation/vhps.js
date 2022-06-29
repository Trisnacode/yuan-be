const Joi = require('joi');

async function validateTransactionHotel(payload) {
  const schema = Joi.object({
    total_transaction: Joi.number(),
    transaction: Joi.array().items(Joi.object({
      token: Joi.string(),
      hotel_code: Joi.string(),
      user: Joi.string(),
      store: Joi.number(),
      invoice_number: Joi.string(),
      total_value: Joi.number(),
      number_of_people: Joi.number(),
      tax: Joi.number(),
      service: Joi.number(),
      discount: Joi.number(),
      created: Joi.date(),
      check_in_date: Joi.date(),
      check_out_date: Joi.date(),
      items: Joi.array().items(Joi.object({
        product_name: Joi.string(),
        quantity: Joi.number(),
        price: Joi.number(),
        ratecode: Joi.string(),
        roomtype: Joi.string(),
      })),
    })),
    vouchers: Joi.array.item(Joi.object({
      voucher_code: Joi.string(),
    })),
    benefits: Joi.array.item(Joi.object({
      benefit_id: Joi.string(),
    })),
  });

  const {error} = schema.validate(payload, {allowUnknown: false, abortEarly: false});

  if (error) {
    return error;
  }

  return true;
}

async function validateTransactionOutlet(payload) {
  const schema = Joi.object({
    total_transaction: Joi.number(),
    transaction: Joi.array().items(Joi.object({
      licence_id: Joi.string(),
      user: Joi.string(),
      store: Joi.number(),
      invoice_number: Joi.string(),
      table_number: Joi.string(),
      open_table_date: Joi.date(),
      cloesed_table_date: Joi.date(),
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
      vouchers: Joi.array.item(Joi.object({
        voucher_code: Joi.string(),
      })),
      benefits: Joi.array.item(Joi.object({
        benefit_id: Joi.string(),
      })),
    })),
  });

  const {error} = schema.validate(payload, {allowUnknown: false, abortEarly: false});

  if (error) {
    return error;
  }

  return true;
}

module.exports = {
  validateTransactionHotel,
  validateTransactionOutlet,
};
