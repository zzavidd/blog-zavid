const { isFalsy } = require('zavid-modules').zLogic;

class QueryBuilder {
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

module.exports = QueryBuilder;