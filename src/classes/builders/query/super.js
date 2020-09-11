const { isFalsy } = require('zavid-modules').zLogic;

class QueryBuilder {
  constructor(knex, table, isMutation = false) {
    if (!isMutation) this.query = knex.select().from(table);
  }

  whereId(id) {
    if (isFalsy(id)) return this;
    this.query.where('id', id);
    return this;
  }

  /**
   * Return the built query.
   * @returns {string} The build Knex query.
   */
  build() {
    return this.query;
  }
}

class MutationBuilder extends QueryBuilder {
  constructor(knex, table, entity) {
    super(knex, table, true);
    this.query = knex(table);
    this.entity = entity;
  }

  insert(input) {
    if (isFalsy(input)) throw new Error(`No specified ${this.entity} to insert.`);
    this.query.insert(input);
    return this;
  }

  update(input) {
    if (isFalsy(input)) throw new Error(`No specified ${this.entity} to update.`);
    this.query.update(input);
    return this;
  }

  delete(id) {
    if (isFalsy(id)) throw new Error(`No specified ${this.entity} to delete.`);
    this.query.where('id', id).del();
    return this;
  }
}

exports.QueryBuilder = QueryBuilder;
exports.MutationBuilder = MutationBuilder;
