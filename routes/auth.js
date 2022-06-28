const express = require('express');
const router = new express.Router();

const authController = require('../app/controller/auth');

/**
 * Member Object
 * @typedef {object} Member
 * @property {string} phone.required - The title
 */

router.group('/api/v1/auth', (routes) => {
  /**
 * POST /auth/register
 * @summary Register Member
 * @tags Authentication
 * @param {Member} request.body.required
 * @example request - example payload
 * {
 * "phone": "628123456789",
 * "password": "password"
 * }
 * @return {object} 200 - success response
 */
  routes.post('/register', authController.register);

  /**
 * POST /auth/login
 * @summary Register Member
 * @tags Authentication
 * @param {Member} request.body.required
 * @example request - example payload
 * {
 * "phone": "628123456789",
 * "password": "password"
 * }
 * @return {object} 200 - success response
 */
  routes.post('/login', authController.login);
});

module.exports = router;
