const { getRandom, checkPostValue } = require('../../src/lib/helpers');

class Publishable {
  static randomStatus() {
    return getRandom(this.statusList);
  }

  /**
   * Checks if submission operation is private.
   * @param {string|object} input - The post or its status value.
   * @returns {boolean} True if the selected status is PRIVATE.
   */
  static isPrivate(input) {
    return checkPostValue(input, 'status', this.STATUSES.PRIVATE);
  }

  /**
   * Checks if submission operation is going to be published.
   * @param {string|object} input - The post or its status value.
   * @returns {boolean} True if the selected status is PUBLISHED.
   */
  static isPublish(input) {
    return checkPostValue(input, 'status', this.STATUSES.PUBLISHED);
  }
}
exports.Publishable = Publishable;