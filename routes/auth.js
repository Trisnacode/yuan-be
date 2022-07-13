const express = require('express');
const router = new express.Router();

const {validateLogin, validateRegister, validateChange, validateProfile} = require('../app/validation/auth');
const authController = require('../app/controller/auth');
const authCmsController = require('../app/controller/authCms');

const {authMember} = require('../app/middleware/auth');


/**
 * Member Object
 * @typedef {object} Member
 * @property {string} phone.required - The title
 */

router.group('/api/v1/auth', (routes) => {
  routes.post('/register', validateRegister, authController.register);
  routes.post('/login', validateLogin, authController.login);
  routes.post('/change-password', authMember, validateChange, authController.changePassword);
  routes.post('/change-profile', authMember, validateProfile, authController.changeProfile);
});

router.group('/api/v1/authcms', (routes) => {
  routes.post('/login', validateLogin, authCmsController.login);
  routes.post('/change-password', authMember, validateChange, authCmsController.changePassword);
});

module.exports = router;
