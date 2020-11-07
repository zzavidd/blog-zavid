import {
  SubscriptionsMapping,
  SubscriptionType,
  SubscriberDAO
} from '../interfaces';

export class SubscriberStatic {
  static SUBSCRIPTIONS = SubscriptionType;

  /**
   * Ensure a subscriber object is able to be operated on.
   * @param {SubscriberDAO} subscriber The subscriber object.
   * @returns {SubscriberDAO} The parsed subscriber object.
   */
  static parse(subscriber: SubscriberDAO): SubscriberDAO {
    try {
      subscriber.subscriptions = JSON.parse(subscriber.subscriptions as string);
    } catch {
      subscriber.subscriptions = {};
    }
    return subscriber;
  }

  /**
   * Generate a default mapping of subscriptions.
   * @returns {SubscriptionsMapping} The subscription mapping.
   */
  static defaultSubscriptions(): SubscriptionsMapping {
    const subscriptions: SubscriptionsMapping = {};
    Object.values(SubscriptionType).forEach((type: string) => {
      subscriptions[type] = true;
    });
    return subscriptions;
  }
}
