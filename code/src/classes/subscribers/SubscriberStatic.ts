import { ISubscriptionType } from 'constants/enums';

export class SubscriberStatic {
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
   * @returns The subscription mapping.
   */
  public static defaultSubscriptions(): SubscriptionsMapping {
    const subscriptions: SubscriptionsMapping = {};
    Object.values(ISubscriptionType).forEach((type: string) => {
      subscriptions[type] = true;
    });
    return subscriptions;
  }
}
