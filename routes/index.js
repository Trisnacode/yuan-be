const express = require('express');
const router = new express.Router();

// const prisma = require('../prisma');


router.group('/', (routes) => {
  routes.get('/', function(req, res, next) {
    res.send('Server is up');
  });
});

router.group('/api/v1/', (routes)=>{
  /**
 * GET /test
 * @summary Testing some functionality
 * @tags Testing
 * @return {object} 200 - success response
 */
  routes.get('/test', async function(req, res, next) {
    return res.send('TEST IS UP');
  });

  /**
 * GET /
 * @summary Testing some functionality
 * @tags Testing
 * @return {object} 200 - success response
 */
  routes.get('/', async function(req, res, next) {
    return res.send('SERVER IS UP');
  });
});

module.exports = router;
