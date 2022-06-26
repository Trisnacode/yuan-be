const express = require('express');
// eslint-disable-next-line new-cap
const router = new express.Router();


router.group('/', (routes) => {
  routes.get('/', function(req, res, next) {
    res.send('Server is Up');
  });
  ;
});

module.exports = router;
