import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

import type { QuerySort, SubscriberDAO } from 'classes';
import {
  SubscriberMutationBuilder,
  SubscriberQueryBuilder,
  SubscriberStatic,
} from 'classes';
import { knex } from 'src/private/db';
import { debug } from 'src/private/error';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
): Promise<void> {
  if (req.method === 'GET') {
    const json = await getAllSubscribers();
    res.json(json);
  } else if (req.method === 'POST') {
    const json = await createSubscriber(req.body);
    res.json(json);
  } else {
    res.send(405);
  }
}

/**
 * Retrieves all subscriber from database.
 * @param args.sort The sort options.
 */
export async function getAllSubscribers(
  options: GetAllSubscriberOptions = {},
): Promise<SubscriberDAO[] | undefined> {
  const { sort = {} } = options;

  try {
    const subscribers = await new SubscriberQueryBuilder(knex)
      .withOrder(sort)
      .build();
    return subscribers.map(SubscriberStatic.parse);
  } catch (e) {
    debug(e);
  }
}

export async function createSubscriber(subscriber: SubscriberDAO) {
  try {
    const [id] = await new SubscriberMutationBuilder(knex)
      .insert({
        ...subscriber,
        subscriptions: JSON.stringify(subscriber.subscriptions),
        token: uuidv4(),
      })
      .build();
    return { id };
  } catch (e) {
    if (typeof e === 'string') {
      throw new Error(e);
    } else if (e instanceof Error) {
      throw e;
    } else {
      throw new Error('An error occurred. Please try again later.');
    }
  }
}

export interface GetAllSubscriberOptions {
  sort?: QuerySort;
}
