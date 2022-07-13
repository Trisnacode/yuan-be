const express = require('express');
const router = new express.Router();

const authController = require('../app/controller/auth');
const memberController = require('../app/controller/member');

router.group('/api/v1/member', (routes) => {
  routes.get('/', memberController.index);
  routes.get('/:id');
  routes.post('/', authController.register);
  routes.patch('/');
  routes.delete('/');
});

module.exports = router;
