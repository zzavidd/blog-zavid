const faker = require('faker');

const { SUBSCRIPTIONS } = require('../../../constants/strings');

/** The class for building Subscriber objects. */
class SubscriberBuilder {
  constructor() {
    this.subscriber = {};
  }

  random() {
    const subscriptions = {};
    Object.values(SUBSCRIPTIONS).forEach((type) => {
      subscriptions[type] = faker.random.boolean();
    });

    this.subscriber = {
      email: faker.internet.email(),
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      subscriptions
    };
    return this;
  }

  /**
   * Builds the subscriber object.
   * @returns {object} The subscriber object.
   */
  build() {
    return this.subscriber;
  }
}

module.exports = SubscriberBuilder;
