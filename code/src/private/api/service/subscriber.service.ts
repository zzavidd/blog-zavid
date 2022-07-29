import { v4 as uuidv4 } from 'uuid';

import type { QuerySort, SubscriberDAO } from '../../../../classes';
import {
  SubscriberMutationBuilder,
  SubscriberQueryBuilder,
  SubscriberStatic,
} from '../../../../classes';
import { ERRORS } from '../../error';
import { getKnex } from '../../singleton';

import { TryWrapper } from './helper';

const knex = getKnex();
const ENTITY_NAME = 'subscriber';

/**
 * Retrieves all subscriber from database.
 * @param args.sort The sort options.
 */
export const getAllSubscribers = (
  options: GetAllSubscriberOptions = {},
): Promise<SubscriberDAO[]> => {
  const { sort = {} } = options;
  return TryWrapper(async () => {
    const subscribers = await new SubscriberQueryBuilder(knex)
      .withOrder(sort)
      .build();
    const parsedSubscribers = subscribers.map((subscriber) =>
      SubscriberStatic.parse(subscriber),
    );
    return parsedSubscribers;
  });
};

/**
 * Retrieves a single subscriber from database.
 * @param args.id The ID of the subscriber.
 */
export const getSingleSubscriber = ({
  id,
}: GetOrDeleteSubscriberOptions): Promise<SubscriberDAO> => {
  return TryWrapper(async () => {
    const [subscriber] = await new SubscriberQueryBuilder(knex)
      .whereId(id)
      .build();
    if (!subscriber) throw ERRORS.NONEXISTENT_ID(id, ENTITY_NAME);
    return SubscriberStatic.parse(subscriber);
  });
};

/**
 * Inserts a new subscriber into the database.
 * @param args.subscriber - The subscriber object to be inserted.
 */
export const createSubscriber = ({
  subscriber,
}: CreateSubscriberOptions): Promise<SubscriberDAO> => {
  Object.assign(subscriber, {
    subscriptions: JSON.stringify(subscriber.subscriptions),
    token: uuidv4(),
  });

  return TryWrapper(async () => {
    const [id] = await new SubscriberMutationBuilder(knex)
      .insert(subscriber)
      .build();
    return { id };
  });
};

/**
 * Updates the fields of a subscriber in the database.
 * @param args.id - The ID of the subscriber to update.
 * @param args.subscriber - The subscriber object to be updated.
 */
export const updateSubscriber = ({
  id,
  subscriber,
}: UpdateSubscriberOptions): Promise<SubscriberDAO> => {
  Object.assign(subscriber, {
    subscriptions: JSON.stringify(subscriber.subscriptions),
  });
  return TryWrapper(async () => {
    await new SubscriberMutationBuilder(knex)
      .update(subscriber)
      .whereId(id)
      .build();
    return getSingleSubscriber({ id });
  });
};

/**
 * Deletes a subscriber from the database.
 * @param {number} args.id - The ID of the subscriber to delete.
 */
export const deleteSubscriber = ({
  id,
}: GetOrDeleteSubscriberOptions): Promise<SubscriberDAO> => {
  return TryWrapper(async () => {
    await getSingleSubscriber({ id });
    await new SubscriberMutationBuilder(knex).delete(id).build();
    return { id };
  });
};

/**
 * Clears all data from the posts table in the database.
 */
export const clearSubscribers = () => {
  return TryWrapper(async () => {
    await new SubscriberMutationBuilder(knex).truncate().build();
  });
};

export type GetAllSubscriberOptions = {
  sort?: QuerySort;
};

export type GetOrDeleteSubscriberOptions = {
  id: number;
};

export type CreateSubscriberOptions = {
  subscriber: SubscriberDAO;
};

export type UpdateSubscriberOptions = {
  id: number;
  subscriber: SubscriberDAO;
};
