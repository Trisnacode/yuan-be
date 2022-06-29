
// const prisma = require('../../prisma');

// import Response
const {HTTP_CODE, RESPONSE_CODE, ERROR_CODE} = require('../response/constant');
const Response = require('../response/default');

// validation
const {validateTransactionOutlet, validateTransactionHotel} = require('../validation/vhps');

async function index(req, res) {
  const Resp = Response.make(res);

  Resp.sendCustomError(HTTP_CODE.NOT_IMPLEMENTED, 'FALSE', '');
}

async function transactionHotel(req, res) {
  const fields = req.body;
  const Resp = Response.make(res);

  // validate input
  const validation = await validateTransactionHotel(fields);
  if (validation !== true) return Resp.sendCustomError(HTTP_CODE.BAD_REQUEST, ERROR_CODE.ERROR_VALIDATION, 'You\'ve validation error');


  Resp.sendCustomError(HTTP_CODE.NOT_IMPLEMENTED, RESPONSE_CODE.SUCCESS_POST_REQUEST, '');
}

async function transactionOutlet(req, res) {
  const Resp = Response.make(res);
  // validate input
  const validation = await validateTransactionOutlet(fields);
  if (validation !== true) return Resp.sendCustomError(HTTP_CODE.BAD_REQUEST, ERROR_CODE.ERROR_VALIDATION, 'You\'ve validation error');


  Resp.sendCustomError(HTTP_CODE.NOT_IMPLEMENTED, RESPONSE_CODE.SUCCESS_POST_REQUEST, '');
}


module.exports = {
  index,
  transactionHotel,
  transactionOutlet,
};
