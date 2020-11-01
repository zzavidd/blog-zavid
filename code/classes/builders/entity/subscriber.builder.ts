import faker from 'faker';

import { SubscriberStatic } from '../../static';
import { SubscriberDAO } from '../../interfaces';

/** The class for building Subscriber objects. */
export class SubscriberBuilder {
  private subscriber: SubscriberDAO = {};

  random() {
    const subscriptions = {};
    Object.values(SubscriberStatic.SUBSCRIPTIONS).forEach((type) => {
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
