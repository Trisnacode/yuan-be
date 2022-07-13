const express = require('express');
const router = new express.Router();

const transactionController = require('../app/controller/transaction');

const {validateTransactionHotel, validateTransactionOutlet} = require('../app/validation/transaction');

router.group('/api/v1/transaction', (routes) => {
  routes.post('/hotel', validateTransactionHotel, transactionController.transactionHotel);
  routes.post('/outlet', validateTransactionOutlet, transactionController.transactionOutlet);
});

module.exports = router;
