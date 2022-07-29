import * as faker from 'faker';

import {
  SubscriberStatic,
  SubscriberDAO,
  SubscriptionsMapping,
  SubscriptionType,
} from '../../index';

/** The class for building Subscriber objects. */
export class SubscriberBuilder {
  private subscriber: SubscriberDAO = {};

  withEmail(email?: string): SubscriberBuilder {
    this.subscriber.email = email!.trim();
    return this;
  }

  withFirstName(firstname?: string): SubscriberBuilder {
    this.subscriber.firstname = firstname!.trim();
    return this;
  }

  withLastName(lastname?: string): SubscriberBuilder {
    this.subscriber.lastname = lastname!.trim();
    return this;
  }

  withSubscriptions(subscriptions?: SubscriptionsMapping): SubscriberBuilder {
    this.subscriber.subscriptions = subscriptions;
    return this;
  }

  withDefaultSubscriptions(): SubscriberBuilder {
    this.subscriber.subscriptions = SubscriberStatic.defaultSubscriptions();
    return this;
  }

  random(): SubscriberBuilder {
    const firstname = faker.name.firstName();
    const lastname = faker.name.lastName();
    const email = faker.internet.email(firstname, lastname).toLowerCase();

    const subscriptions: SubscriptionsMapping = {};
    Object.values(SubscriptionType).forEach((type: string) => {
      subscriptions[type] = faker.random.boolean();
    });

    this.subscriber = {
      firstname,
      lastname,
      email,
      subscriptions,
    };

    return this;
  }

  build(): SubscriberDAO {
    return this.subscriber;
  }
}
