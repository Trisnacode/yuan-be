// import Response
const {RESPONSE_CODE, ERROR_CODE} = require('../response/constant');
const Response = require('../response/default');

const randomstring = require('randomstring');

// import model
const Member = require('../model/member');
const Voucher = require('../model/voucher');
const MemberVoucher = require('../model/memberVoucher');


async function index(req, res) {
  const resp = Response.make(res);
  const fields = req.query;
  try {
    const data = await Voucher.query()
        .whereNotDeleted()
        .page(fields.page, fields.limit);

    resp.send(RESPONSE_CODE.SUCCESS_GET_REQUEST, 'success', data);
  } catch (error) {
    console.error(error);
    resp.sendServerError(ERROR_CODE.ERROR_SERVER, error);
  }
}

async function indexMember(req, res) {
  const resp = Response.make(res);
  const fields = req.query;
  try {
    const data = await Voucher.query()
        .whereNotDeleted()
        .where('is_buyable', true)
        .page(fields.page, fields.limit);

    resp.send(RESPONSE_CODE.SUCCESS_GET_REQUEST, 'success', data);
  } catch (error) {
    console.error(error);
    resp.sendServerError(ERROR_CODE.ERROR_SERVER, error);
  }
}

async function detail(req, res) {
  const resp = Response.make(res);
  const id = req.params.id;

  try {
    const data = await Voucher.query().whereNotDeleted().findById(id);
    resp.send(RESPONSE_CODE.SUCCESS_GET_REQUEST, 'success', data);
  } catch (error) {
    console.error(error);
    resp.sendServerError(ERROR_CODE.ERROR_SERVER, error);
  }
}

async function store(req, res) {
  const resp = Response.make(res);
  const fields = req.body;

  try {
    await Voucher.query()
        .whereNotDeleted()
        .insert({
          code: fields.code,
          title: fields.title,
          description: fields.description,
          tnc: fields.tnc,

          // TODO : Uploads Image
          // image: fields.image,

          required_point: fields.required_point,
          discount_amount: fields.discount_amount,
          discount_percent: fields.discount_percent,
          minimum_spending: fields.minimum_spending,

          quantity: fields.quantity,
          remaining: fields.quantity,

          expired_at: fields.expired_at,
          is_active: fields.is_active,
          is_buyable: fields.is_buyable,
        });

    resp.send(RESPONSE_CODE.SUCCESS_POST_REQUEST, 'success');
  } catch (error) {
    console.error(error);
    resp.sendServerError(ERROR_CODE.ERROR_SERVER, error);
  }
}

async function update(req, res) {
  const resp = Response.make(res);
  const fields = req.body;

  if (!fields.id) return resp.sendClientError(ERROR_CODE.MISSING_DATA, 'Missing id');

  try {
    const voucher = await Voucher.query().whereNotDeleted().findById(fields.id);
    if (!voucher) {
      return resp.sendClientError(ERROR_CODE.ERROR_NOT_FOUND, 'Voucher not found');
    }
    let quantity = voucher.quantity;
    let remaining = voucher.remaining;


    // readjust quantity and remaining voucher
    if (fields.quantity) {
      // check if remaining is enough
      if (fields.quantity >= voucher.quantity) {
        const margin = fields.quantity - voucher.quantity;
        quantity = fields.quantity;
        remaining = voucher.remaining + margin;
      } else {
        const margin = voucher.quantity - fields.quantity;
        if (remaining - margin < 0) return resp.sendClientError('INVALID_DATA', 'Not enough quantity');
        quantity = fields.quantity;
        remaining = voucher.remaining - margin;
      }
    }

    await Voucher.query().whereNotDeleted()
        .updateAndFetchById(fields.id, {
          title: fields.title,
          description: fields.description,

          // TODO : Uploads Image
          // image: fields.image,

          required_point: fields.required_point,
          discount_amount: fields.discount_amount,
          discount_percent: fields.discount_percent,
          minimum_spending: fields.minimum_spending,

          quantity: quantity,
          remaining: remaining,

          expired_at: fields.expired_at,
          is_active: fields.is_active,
          is_buyable: fields.is_buyable,
        });


    resp.send(RESPONSE_CODE.SUCCESS_PATCH_REQUEST, 'success');
  } catch (error) {
    console.error(error);
    resp.sendServerError(ERROR_CODE.ERROR_SERVER, error);
  }
}

async function deleteItem(req, res) {
  const Resp = Response.make(res);
  const fields = req.body;

  try {
    // delete voucher
    await Voucher.query().deleteById(fields.id);
    Resp.send(RESPONSE_CODE.SUCCESS_DELETE_REQUEST, 'success');
  } catch (error) {
    console.error(error);
    Resp.sendServerError(ERROR_CODE.ERROR_SERVER, error);
  }
}

async function gift(req, res) {
  const Resp = Response.make(res);
  const fields = req.body;

  try {
    if (fields.code) {
      const code = await MemberVoucher.query().whereNotDeleted().findOne({code: fields.code});
      if (code) return Resp.sendClientError(ERROR_CODE.ERROR_DUPICATE_REQUEST, 'Voucher code already exist');
    }
    const data = await assignVoucher(fields);
    Resp.send(RESPONSE_CODE.SUCCESS_POST_REQUEST, 'success', data);
  } catch (error) {
    console.error(error);
    Resp.sendServerError(ERROR_CODE.ERROR_SERVER, error.message);
  }
}

async function buy(req, res) {
  const Resp = Response.make(res);
  const fields = req.body;

  try {
    const memberId = fields.member_id || req.member.id;
    // deduce from current point
    const voucher = await Voucher.query().whereNotDeleted().findOne({
      id: fields.voucher_id,
      is_buyable: true,
    });
    if (!voucher) {
      return Resp.sendClientError(ERROR_CODE.ERROR_NOT_FOUND, 'Voucher not found');
    }

    const requiredPoint = voucher.required_point || 0;
    const member = await Member.query().whereNotDeleted().findOne({id: memberId});

    // check if have enough point
    if (member.current_point < requiredPoint) {
      return Resp.sendClientError('NOT_ENOUGH_POINT', 'Not enough point');
    }

    // gift point to member
    const data = await assignVoucher(fields);

    // deduce data
    if (data) {
      await Member.query()
          .whereNotDeleted()
          .where('id', memberId)
          .patch({
            current_point: member.current_point - requiredPoint,
          });
    }
    Resp.send(RESPONSE_CODE.SUCCESS_POST_REQUEST, 'success', data);
  } catch (error) {
    console.error(error);
    Resp.sendServerError(ERROR_CODE.ERROR_SERVER, error.message);
  }
}

async function burn(req, res) {
  const Resp = Response.make(res);
  const fields = req.body;

  try {
    if (!fields.member_id) {
      const Member = await Member.query().whereNotDeleted().findOne({phone: fields.member_phone});
      fields.member_id = Member.id;
    }

    const vouchers = fields.vouchers;
    const burned = [];
    for (let i = 0; i < vouchers.length; i++) {
      const voucher = await MemberVoucher.query().whereNotDeleted()
          .where('member_id', fields.member_id)
          .where('code', vouchers[i].voucher_code)
          .whereNull('burned_at')
          .where('is_active', true)
          .andWhere((builder) => {
            builder.orWhereNull('expired_at');
            builder.orWhere('expired_at', '>', new Date());
          })
          .first();

      if (voucher) {
        await MemberVoucher.query().whereNotDeleted()
            .where('id', voucher.id)
            .patch({
              burned_at: new Date(),
              data: JSON.stringify({
                outlet_id: fields.outlet_id,
                cashier_id: fields.cashier_id,
                cashier_name: fields.cashier_name,
              }),
            });

        // get voucher detail
        const voucherDetail = await Voucher.query()
            .whereNotDeleted()
            .select('discount_amount', 'discount_percent', 'minimum_spending', 'data')
            .findOne({id: voucher.voucher_id});

        // edit payload
        voucherDetail.voucher_code = voucher.code;

        burned[i] = voucherDetail;
      }
    }
    Resp.send(RESPONSE_CODE.SUCCESS_POST_REQUEST, 'success', burned);
  } catch (error) {
    console.error(error);
    Resp.sendServerError(ERROR_CODE.ERROR_SERVER, error.message);
  }
}

async function unburn(req, res) {
  const Resp = Response.make(res);
  const fields = req.body;

  try {
    if (!fields.member_id) {
      const Member = await Member.query().whereNotDeleted().findOne({phone: fields.member_phone});
      fields.member_id = Member.id;
    }

    const vouchers = fields.vouchers;
    const unburned = [];
    for (let i = 0; i < vouchers.length; i++) {
      await MemberVoucher.query().whereNotDeleted()
          .where('code', vouchers[i].voucher_code)
          .patch({
            burned_at: null,
            data: null,
          });
      unburned[i] = vouchers[i];
    }
    Resp.send(RESPONSE_CODE.SUCCESS_POST_REQUEST, 'success', unburned);
  } catch (error) {
    console.error(error);
    Resp.sendServerError(ERROR_CODE.ERROR_SERVER, error.message);
  }
}

async function myVoucher(req, res) {
  const Resp = Response.make(res);
  const memberId = req.member.id;
  try {
    const data = await MemberVoucher.query()
        .whereNotDeleted()
        .withGraphFetched('voucher')
        .where('member_id', memberId);
    Resp.send(RESPONSE_CODE.SUCCESS_GET_REQUEST, 'success', data);
  } catch (error) {
    console.error(error);
    Resp.sendServerError(ERROR_CODE.ERROR_SERVER, error.message);
  }
}

// SERVICE
async function assignVoucher(payload) {
  try {
    const code = payload.code || randomstring.generate({
      length: 7,
      charset: 'alphanumeric',
      capitalization: 'uppercase',
      readable: true,
    });

    const data = await MemberVoucher.transaction(async (trx) => {
      const voucher = await Voucher.query(trx)
          .whereNotDeleted()
          .findOne({id: payload.voucher_id});

      if (voucher.remaining == 0) throw new Error('Voucher is out of stock');

      const result = await MemberVoucher.query(trx)
          .insertAndFetch({
            member_id: payload.member_id,
            voucher_id: payload.voucher_id,
            code: code,
            is_active: payload.is_active,
            expired_at: payload.expired_at,
          });

      // Deduce Quantity from voucher
      await Voucher.query(trx)
          .whereNotDeleted()
          .where('id', voucher.id)
          .patch({
            remaining: voucher.remaining - 1,
          });

      return result;
    });

    return data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

module.exports = {
  index,
  indexMember,
  detail,
  store,
  update,
  deleteItem,
  gift,
  buy,
  burn,
  unburn,
  myVoucher,
};
