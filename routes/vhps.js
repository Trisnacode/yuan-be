const express = require('express');
const router = new express.Router();

const vhpsController = require('../app/controller/vhps');

/**
 * Member Object
 * @typedef {object} Member
 * @property {string} phone.required - The title
 */

router.group('/api/v1/vhps', (routes) => {
  /**
 * POST /vhps/v1/transaction/hotel
 * @summary Front Office Transaction
 * @tags VHPS
 * @param {Member} request.body.required
 * @example request - example payload
 * {
 * "phone": "628123456789",
 * "password": "password"
 * }
 * @return {object} 200 - success response
 */
  routes.post('/v1/transaction/hotel', vhpsController.transactionHotel);

  /**
 * POST /vhps/v1/transaction/outlet
 * @summary Outlet Transaction
 * @tags VHPS
 * @param {Member} request.body.required
 * @example request - example payload
 * {
 * "phone": "628123456789",
 * "password": "password"
 * }
 * @return {object} 200 - success response
 */
  routes.post('/v1/transaction/hotel', vhpsController.transactionOutlet);
});

module.exports = router;
