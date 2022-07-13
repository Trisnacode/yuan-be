// import Response
const {RESPONSE_CODE, ERROR_CODE, HTTP_CODE} = require('../response/constant');
const Response = require('../response/default');

// import model
const Member = require('../model/member');
const Transaction = require('../model/transaction');
const TransactionItem = require('../model/transactionItem');

async function transactionHotel(req, res) {
  const Resp = Response.make(res);
  const fields = req.body;
  try {
    const total = fields.total_transaction;
    const transactions = fields.transactions;

    const data = [];
    for (let i = 0; i < total; i++) {
      // Get Member Id
      const transaction = transactions[i];
      transaction.member_id = -1; // set to -1 for no member
      const memberPhone = transaction.member_phone;
      if (memberPhone) {
        const memberData = await Member.query().select('id').findOne({'phone': memberPhone});
        transaction.member_id = memberData ? memberData.id : -1;
      }
      const result = await insertTransaction(transactions[i], 'HOTEL');
      data[i] = result;
    }


    Resp.send(RESPONSE_CODE.SUCCESS_POST_REQUEST, 'success', data);
  } catch (error) {
    console.error(error);
    Resp.sendCustomError(HTTP_CODE.SERVER_ERROR, ERROR_CODE.INTERNAL_SERVER_ERROR, error);
  }
}

async function transactionOutlet(req, res) {
  const Resp = Response.make(res);
  const fields = req.body;
  try {
    const total = fields.total_transaction;
    const transactions = fields.transactions;

    const data = [];
    for (let i = 0; i < total; i++) {
      // Get Member Id
      const transaction = transactions[i];
      transaction.member_id = -1; // set to -1 for no member
      const memberPhone = transaction.member_phone;
      if (memberPhone) {
        const memberData = await Member.query().select('id').findOne({'phone': memberPhone});
        transaction.member_id = memberData ? memberData.id : -1;
      }
      const result = await insertTransaction(transactions[i], 'OUTLET');
      data[i] = result;
    }


    Resp.send(RESPONSE_CODE.SUCCESS_POST_REQUEST, 'success', data);
  } catch (error) {
    console.error(error);
    Resp.sendCustomError(HTTP_CODE.SERVER_ERROR, ERROR_CODE.INTERNAL_SERVER_ERROR, error);
  }
}

// Service for Insert Transaction and Items
// Move it if want to use MVSC pattern
async function insertTransaction(transaction, type) {
  try {
    const data = Transaction.transaction(async (trx) => {
      // Insert Transaction
      const transacPayload = {
        type: type,
        invoice: transaction.invoice_number,

        total_value: transaction.total_value,
        tax: transaction.tax,
        service: transaction.service,
        discount: transaction.discount,

        done_at: transaction.created_at,
        transaction_data: {},
      };

      // if have memberId
      if (transaction.member_id !== -1) transacPayload.member_id = transaction.member_id;


      if (type == 'HOTEL') {
        transacPayload.number_of_people = transaction.number_of_people;
        transacPayload.opened_at = transaction.check_in_at;
        transacPayload.closed_at = transaction.check_out_at;
      }

      if (type == 'OUTLET') {
        transacPayload.store_id = transaction.store_id;
        transacPayload.split_number= transaction.split_number;
        transacPayload.opened_at = transaction.open_table_at;
        transacPayload.closed_at = transaction.close_table_at;
      }

      // if use voucher
      if (transaction.vouchers) {
        transacPayload.transaction_data.vouchers = transaction.vouchers;
      }

      // if user benefits
      if (transaction.benefits) {
        transacPayload.transaction_data.benefits = transaction.benefits;
      }

      // Convert total transaction as voucher
      if (transaction.member_id) {
        const {point} = await convertToPoint(transaction.member_id, transaction);
        transacPayload.transaction_data.total_point = point;
      }

      const transac = await Transaction.query(trx).insertAndFetch(transacPayload);

      // Insert Items
      const items = transaction.items;
      if (items.length == 0) return transac;

      for (let i = 0; i <items.length; i++ ) {
        const item = items[i];
        const itemPayload = {
          transaction_id: transac.id,
          name: item.product_name,
          qty: item.quantity,
          price: item.price,
          item_data: {},
          transaction_id: transac.id,
        };

        if (type == 'HOTEL') {
          itemPayload.item_data.rate_code = item.ratecode;
          itemPayload.item_data.room_type = item.roomtype;
        }

        await TransactionItem.query(trx).insert(itemPayload);
      }
    });

    return data;
  } catch (error) {
    throw new Error(error);
  }
}


// Logic to convert transaction to point
async function convertToPoint(memberId, transaction) {
  // Some Logic to convert transaction to point
  const point = 0;

  return {point};
}


module.exports = {
  transactionHotel,
  transactionOutlet,
};

