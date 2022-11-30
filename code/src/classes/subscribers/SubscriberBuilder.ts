import * as faker from 'faker';

import { ISubscriptionType } from 'constants/enums';

import { SubscriberStatic } from './SubscriberStatic';

/** The class for building Subscriber objects. */
export class SubscriberBuilder {
  private subscriber: SubscriberDAO = {
    email: '',
  };

  constructor() {
    this.subscriber.firstname = '';
    this.subscriber.lastname = '';
  }

  public withEmail(email?: string): SubscriberBuilder {
    this.subscriber.email = email!.trim();
    return this;
  }

  public withFirstName(firstname?: string): SubscriberBuilder {
    this.subscriber.firstname = firstname!.trim();
    return this;
  }

  public withLastName(lastname?: string): SubscriberBuilder {
    this.subscriber.lastname = lastname!.trim();
    return this;
  }

  public withSubscriptions(
    subscriptions?: SubscriptionsMapping,
  ): SubscriberBuilder {
    this.subscriber.subscriptions = subscriptions;
    return this;
  }

  public withDefaultSubscriptions(): SubscriberBuilder {
    this.subscriber.subscriptions = SubscriberStatic.defaultSubscriptions();
    return this;
  }

  public random(): SubscriberBuilder {
    const firstname = faker.name.firstName();
    const lastname = faker.name.lastName();
    const email = faker.internet.email(firstname, lastname).toLowerCase();

    const subscriptions: SubscriptionsMapping = {};
    Object.values(ISubscriptionType).forEach((type: string) => {
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

  public build(): SubscriberDAO {
    return this.subscriber;
  }
}
