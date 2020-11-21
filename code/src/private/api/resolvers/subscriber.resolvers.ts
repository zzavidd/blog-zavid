import { SubscriberService } from '../service';

/**
 * Retrieves all subscriber from database.
 */
const getAllSubscribers = (
  parent: unknown,
  args: SubscriberService.GetAllSubscriberOptions
) => SubscriberService.getAllSubscribers(args);

/**
 * Retrieves a single subscriber from database.
 */
const getSingleSubscriber = (
  parent: unknown,
  args: SubscriberService.GetOrDeleteSubscriberOptions
) => SubscriberService.getSingleSubscriber(args);

/**
 * Inserts a new subscriber into the database.
 */
const createSubscriber = (
  parent: unknown,
  args: SubscriberService.CreateSubscriberOptions
) => SubscriberService.createSubscriber(args);

/**
 * Updates the fields of a subscriber in the database.
 */
const updateSubscriber = (
  parent: unknown,
  args: SubscriberService.UpdateSubscriberOptions
) => SubscriberService.updateSubscriber(args);

/**
 * Deletes a subscriber from the database.
 */
const deleteSubscriber = (
  parent: unknown,
  args: SubscriberService.GetOrDeleteSubscriberOptions
) => SubscriberService.deleteSubscriber(args);

export default {
  Query: {
    subscribers: getAllSubscribers,
    subscriber: getSingleSubscriber
  },
  Mutation: {
    createSubscriber,
    updateSubscriber,
    deleteSubscriber
  }
};
