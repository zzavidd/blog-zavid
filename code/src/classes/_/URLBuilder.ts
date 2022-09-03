export class URLBuilder {
  private url = '';

  /**
   * Append a value to the URL.
   */
  public append(value: string): URLBuilder {
    this.url += value;
    return this;
  }

  /**
   * Append a new segment to the URL separated by a slash.
   */
  public appendSegment(segment: string): URLBuilder {
    this.url += `/${segment}`;
    return this;
  }

  /**
   * Return the built URL string.
   */
  public build(): string {
    return this.url;
  }
}
