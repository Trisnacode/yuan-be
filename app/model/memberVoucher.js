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
class MemberVoucher extends softDelete(Model) {
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
    return 'MemberVoucher';
  }

  /**
   * define relation name
   * @return {object}
   */
  static get relationMappings() {
    const Member = require('./member');
    const Voucher = require('./voucher');
    return ({
      member: {
        relation: Model.BelongsToOneRelation,
        modelClass: Member,
        join: {
          from: 'MemberVoucher.member_id',
          to: 'Member.id',
        },
      },
      voucher: {
        relation: Model.BelongsToOneRelation,
        modelClass: Voucher,
        join: {
          from: 'MemberVoucher.voucher_id',
          to: 'Voucher.id',
        },
      },
    });
  }
}

module.exports = MemberVoucher;
