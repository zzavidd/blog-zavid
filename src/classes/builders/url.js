const { zLogic } = require('zavid-modules');
const { isFalsy } = zLogic;

class URLBuilder {
  constructor() {
    this.url = '';
  }

  /**
   * Append a value to the URL.
   * @param {string} value The text to append.
   * @returns {URLBuilder} The URLBuilder.
   */
  append(value) {
    if (isFalsy(value)) return this;
    this.url += value;
    return this;
  }

  /**
   * Append a new segment to the URL separated by a slash.
   * @param {string} segment The segment to append.
   * @returns {URLBuilder} The URLBuilder.
   */
  appendSegment(segment) {
    if (isFalsy(segment)) return this;
    this.url += `/${segment}`;
    return this;
  }

  /**
   * Return the built URL string.
   * @returns {string} The built URL string.
   */
  build() {
    return this.url;
  }
}

module.exports = URLBuilder;
