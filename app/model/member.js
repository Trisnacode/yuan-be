const {Model} = require('objection');
const objectionSoftDelete = require('objection-js-soft-delete');
const knex = require('./knex');
Model.knex(knex);

/**
 * Define Soft Delete Module
 */
const softDelete = objectionSoftDelete.default({
  columnName: 'deleted_at',
  deletedValue: new Date(),
  notDeletedValue: null,
});


/**
 * Define model
 * @extends Model
 */
class Member extends softDelete(Model) {
  /**
   * create action before insert in database
   */
  $beforeInsert() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  /**
   * create action before update in database
   */
  $beforeUpdate() {
    this.updated_at = new Date();
  }

  /**
   * define table name
   * @return {string}
   */
  static get tableName() {
    return 'Member';
  }

  /**
   * define relation name
   * @return {object}
   */
  static get relationMappings() {
    const Transaction = require('./transaction');
    const Voucher = require('./voucher');
    const MemberVoucher = require('./memberVoucher');
    return ({
      transaction: {
        relation: Model.HasManyRelation,
        modelClass: Transaction,
        join: {
          from: 'Member.id',
          to: 'Transaction.member_id',
        },
      },
      voucher: {
        relation: Model.ManyToManyRelation,
        modelClass: Voucher,
        join: {
          from: 'Member.id',
          through: {
            from: 'MemberVoucher.member_id',
            to: 'MemberVoucher.voucher_id',
          },
          to: 'Voucher.id',
        },
      },
      memberVoucher: {
        relation: Model.HasManyRelation,
        modelClass: MemberVoucher,
        join: {
          from: 'Member.id',
          to: 'MemberVoucher.member_id',
        },
      },
    });
  }
}

module.exports = Member;
