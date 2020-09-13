class Subscriber {
  /**
   * Ensure a subscriber object is able to be operated on.
   * @param {object} subscriber The subscriber object.
   * @returns {object} The parsed subscriber object.
   */
  static parse(subscriber) {
    try {
      subscriber.subscriptions = JSON.parse(subscriber.subscriptions);
    } catch {
      subscriber.subscriptions = {};
    }
    return subscriber;
  }
}

module.exports = Subscriber;
