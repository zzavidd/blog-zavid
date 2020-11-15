const { zLogic } = require('zavid-modules');
const { isFalsy } = zLogic;

export class URLBuilder {

  private url: string = ''

  /**
   * Append a value to the URL.
   * @param {string} value The text to append.
   * @returns {URLBuilder} The URLBuilder.
   */
  append(value: string): URLBuilder {
    if (isFalsy(value)) return this;
    this.url += value;
    return this;
  }

  /**
   * Append a new segment to the URL separated by a slash.
   * @param {string} segment The segment to append.
   * @returns {URLBuilder} The URLBuilder.
   */
  appendSegment(segment: string): URLBuilder {
    if (!segment) return this;
    this.url += `/${segment}`;
    return this;
  }

  /**
   * Return the built URL string.
   * @returns {string} The built URL string.
   */
  build(): string {
    return this.url;
  }
}
