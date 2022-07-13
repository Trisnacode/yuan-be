const express = require('express');
const router = new express.Router();

const voucherController = require('../app/controller/voucher');

const {validateInsert, validateUpdate, validateId, validateGift, validateBurn, validateUnburn, validateBuy} = require('../app/validation/voucher');
const {authMember} = require('../app/middleware/auth');

router.group('/api/v1/voucher', (routes) => {
  routes.get('/', voucherController.index);
  routes.get('/:id', validateId, voucherController.detail);
  routes.post('/', validateInsert, voucherController.store);
  routes.patch('/', validateUpdate, voucherController.update);
  routes.delete('/', validateId, voucherController.deleteItem);
  routes.post('/gift', validateGift, voucherController.gift);
  routes.post('/burn', validateBurn, voucherController.burn);
  routes.post('/unburn', validateUnburn, voucherController.unburn);

  routes.get('/member/list', authMember, voucherController.indexMember);
  routes.post('/member/buy', authMember, validateBuy, voucherController.buy);

  routes.get('/my/list', authMember, voucherController.myVoucher);
});

module.exports = router;
