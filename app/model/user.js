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
class User extends softDelete(Model) {
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
    return 'User';
  }
}

module.exports = User;
