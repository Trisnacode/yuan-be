const express = require('express');
const router = new express.Router();

const vhpsController = require('../app/controller/vhps');

router.group('/api/v1/vhps', (routes) => {
  routes.post('/v1/transaction/hotel', vhpsController.transactionHotel);
  routes.post('/v1/transaction/hotel', vhpsController.transactionOutlet);
});

module.exports = router;
