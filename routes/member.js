const express = require('express');
const router = new express.Router();

const authController = require('../app/controller/auth');
const memberController = require('../app/controller/member');

/**
 * Member Object
 * @typedef {object} Member
 * @property {int} id
 * @property {string} phone.required - The title
 * @property {string} password - The title
 */

router.group('/api/v1/member', (routes) => {
  /**
 * GET /member
 * @summary Get Member API
 * @tags Member
 * @return {object} 200 - success response
 */
  routes.get('/', memberController.index);

  /**
 * GET /member/{id}
 * @summary Get Member API
 * @tags Member
 * @param {id} request.path
 * @return {object} 200 - success response
 */
  routes.get('/:id');


  /**
 * POST /member
 * @summary Register Member Directly
 * @tags Member
 * @param {Member} request.body.required
 * @example request - example payload
 * {
 * "phone": "628123456789",
 * "password": "password"
 * }
 * @return {object} 200 - success response
 */
  routes.post('/', authController.register);

  /**
 * PATCH /member
 * @summary Edit Member Directly
 * @tags Member
 * @param {Member} request.body.required
 * @example request - example payload
 * {
 * "phone": "628123456789",
 * "password": "password"
 * }
 * @return {object} 200 - success response
 */
  routes.patch('/');

  /**
 * DELETE /member
 * @summary Register Member Directly
 * @tags Member
 * @param {Member} request.body.required
 * @example request - example payload
 * {
 * "id": 1
 * }
 * @return {object} 200 - success response
 */
  routes.delete('/');
});

module.exports = router;
