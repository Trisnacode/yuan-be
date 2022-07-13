const express = require('express');
const router = new express.Router();


router.group('/', (routes) => {
  routes.get('/', function(req, res, next) {
    res.send('Server is up');
  });
});

router.group('/api/v1/', (routes)=>{
  routes.get('/test', async function(req, res, next) {
    console.log(req.user);
    return res.send('TEST IS UP');
  });
  routes.get('/', async function(req, res, next) {
    return res.send('SERVER IS UP');
  });
});

module.exports = router;
