/** Builds a post query with conditions. */
class ErrorBuilder {
  constructor(message, status) {
    this.error = new Error(message);
    if (status) this.error.status = status;
    return this.error;
  }
}

module.exports = ErrorBuilder;