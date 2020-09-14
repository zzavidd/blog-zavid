const SUBSCRIPTIONS = {
  REVERIES: 'Reveries',
  DIARY: 'Diary'
};

class Subscriber {
  static SUBSCRIPTIONS = SUBSCRIPTIONS;

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

  static subscriptionsToString(subscriber) {
    const subscriptions = Object.entries(subscriber.subscriptions)
      .filter(([key]) => !key.startsWith('_'))
      .map(([key, value]) => {
        return `${key}: ${value}\n`;
      });

    return subscriptions;
  }

  static defaultSubscriptions() {
    const subscriptions = {};
    Object.values(Subscriber.SUBSCRIPTIONS).forEach((type) => {
      subscriptions[type] = true;
    });
    return subscriptions;
  }
}

module.exports = Subscriber;
