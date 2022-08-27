import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

import type { QuerySort, SubscriberDAO } from 'classes';
import {
  SubscriberMutationBuilder,
  SubscriberQueryBuilder,
  SubscriberStatic,
} from 'classes';
import { knex } from 'constants/knex';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
): Promise<void> {
  switch (req.method) {
    case 'GET': {
      const json = await getAllSubscribers();
      return res.json(json);
    }
    case 'POST': {
      const json = await createSubscriber(req.body);
      return res.json(json);
    }
    case 'PUT': {
      const { id, subscriber } = req.body;
      const json = await updateSubscriber(id, subscriber);
      return res.json(json);
    }
    case 'DELETE': {
      const json = await deleteSubscriber(req.body.id);
      return res.json(json);
    }
    default: {
      res.send(405);
    }
  }
}

export async function getAllSubscribersSSR(options: GetAllSubscriberOptions) {
  return JSON.stringify(await getAllSubscribers(options));
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
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function getSubscriberByTokenSSR(token: string) {
  return JSON.stringify(await getSubscriberByToken(token));
}

export async function getSubscriberByToken(token: string) {
  const [subscriber] = await new SubscriberQueryBuilder(knex)
    .whereToken(token)
    .build();
  return SubscriberStatic.parse(subscriber);
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
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function updateSubscriber(id: number, subscriber: SubscriberDAO) {
  try {
    await new SubscriberMutationBuilder(knex)
      .update(subscriber)
      .whereId(id)
      .build();
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function deleteSubscriber(id: number) {
  try {
    await new SubscriberMutationBuilder(knex).delete(id).build();
  } catch (e: any) {
    throw new Error(e);
  }
}

export interface GetAllSubscriberOptions {
  sort?: QuerySort<SubscriberDAO>;
}
