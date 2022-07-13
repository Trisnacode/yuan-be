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
class TransactionItem extends softDelete(Model) {
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
    return 'TransactionItem';
  }

  /**
   * define relation name
   * @return {object}
   */
  static get relationMappings() {
    const Transaction = require('./transaction');
    return ({
      transaction: {
        relation: Model.BelongsToOneRelation,
        modelClass: Transaction,
        join: {
          from: 'TransactionItem.transaction_id',
          to: 'Transaction.id',
        },
      },
    });
  }
}

module.exports = TransactionItem;
