export class URLBuilder {
  private url = '';

  /**
   * Append a value to the URL.
   */
  append(value: string): URLBuilder {
    this.url += value;
    return this;
  }

  /**
   * Append a new segment to the URL separated by a slash.
   */
  appendSegment(segment: string): URLBuilder {
    this.url += `/${segment}`;
    return this;
  }

  /**
   * Return the built URL string.
   */
  build(): string {
    return this.url;
  }
}
