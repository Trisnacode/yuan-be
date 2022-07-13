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
class Voucher extends softDelete(Model) {
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
    return 'Voucher';
  }

  /**
   * define relation name
   * @return {object}
   */
  static get relationMappings() {
    const MemberVoucher = require('./memberVoucher');
    const Member = require('./member');
    return ({
      memberVoucher: {
        relation: Model.HasManyRelation,
        modelClass: MemberVoucher,
        join: {
          from: 'Voucher.id',
          to: 'MemberVoucher.voucher_id',
        },
      },
      member: {
        relation: Model.ManyToManyRelation,
        modelClass: Member,
        join: {
          from: 'Voucher.id',
          through: {
            from: 'MemberVoucher.voucher_id',
            to: 'MemberVoucher.member_id',
          },
        },
      },
    });
  }
}

module.exports = Voucher;
