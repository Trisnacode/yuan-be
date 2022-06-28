const express = require('express');
// eslint-disable-next-line new-cap
const router = new express.Router();

const prisma = require('../prisma');


router.group('/', (routes) => {
  /**
 * GET /
 * @summary Testing if server is up or not
 * @tags Testing
 * @return {object} 200 - success response
 */
  routes.get('/', function(req, res, next) {
    res.send('Server is up');
  });
});

router.group('/api/v1/auth', (routes)=>{
  /**
 * GET /test
 * @summary Testing some functionality
 * @tags Testing
 * @return {object} 200 - success response
 */
  routes.get('/test', async function(req, res, next) {
    const data = await prisma.member.delete({
      where: {
        phone: '628123456789',
      },
    });

    return res.send(data);
  })
  ;
});

module.exports = router;
