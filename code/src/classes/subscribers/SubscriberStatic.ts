import type { SubscriberDAO, SubscriptionsMapping } from './SubscriberDAO';
import { SubscriptionType } from './SubscriberDAO';

export class SubscriberStatic {
  public static SUBSCRIPTIONS = SubscriptionType;

  /**
   * Ensure a subscriber object is able to be operated on.
   * @param {SubscriberDAO} subscriber The subscriber object.
   * @returns {SubscriberDAO} The parsed subscriber object.
   */
  public static parse(subscriber: SubscriberDAO): SubscriberDAO {
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
  public static defaultSubscriptions(): SubscriptionsMapping {
    const subscriptions: SubscriptionsMapping = {};
    Object.values(SubscriptionType).forEach((type: string) => {
      subscriptions[type] = true;
    });
    return subscriptions;
  }
}
