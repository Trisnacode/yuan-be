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
class Transaction extends softDelete(Model) {
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
    return 'Transaction';
  }

  /**
   * define relation name
   * @return {object}
   */
  static get relationMappings() {
    const TransactionItem = require('./transactionItem');
    const Member = require('./member');
    return ({
      transactionItem: {
        relation: Model.HasManyRelation,
        modelClass: TransactionItem,
        join: {
          from: 'Transaction.id',
          to: 'TransactionItem.transaction_id',
        },
      },
      member: {
        relation: Model.BelongsToOneRelation,
        modelClass: Member,
        join: {
          from: 'Transaction.member_id',
          to: 'Member.id',
        },
      },
    });
  }
}

module.exports = Transaction;
