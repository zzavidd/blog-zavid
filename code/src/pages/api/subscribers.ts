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
  try {
    switch (req.method) {
      case 'GET': {
        await getAllSubscribers();
        return res.send(200);
      }
      case 'POST': {
        await createSubscriber(req.body);
        return res.send(201);
      }
      case 'PUT': {
        await updateSubscriber(req.body);
        return res.send(200);
      }
      case 'DELETE': {
        await deleteSubscriber(req.body);
        return res.send(204);
      }
      default: {
        res.send(405);
      }
    }
  } catch (e: any) {
    res.status(400).json({ message: e.message });
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

export async function getSubscriberByIdSSR(id: number) {
  const [subscriber] = await new SubscriberQueryBuilder(knex)
    .whereId(id)
    .build();
  return JSON.stringify(SubscriberStatic.parse(subscriber));
}

export async function createSubscriber({
  subscriber,
}: CreateSubscriberPayload) {
  try {
    await new SubscriberMutationBuilder(knex)
      .insert({
        ...subscriber,
        subscriptions: JSON.stringify(subscriber.subscriptions),
        token: uuidv4(),
      })
      .build();
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function updateSubscriber({
  id,
  subscriber,
}: UpdateSubscriberPayload) {
  try {
    await new SubscriberMutationBuilder(knex)
      .update({
        ...subscriber,
        subscriptions: JSON.stringify(subscriber.subscriptions),
      })
      .whereId(id)
      .build();
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function deleteSubscriber({ id }: DeleteSubscriberPayload) {
  try {
    await new SubscriberMutationBuilder(knex).delete(id).build();
  } catch (e: any) {
    throw new Error(e);
  }
}

export interface GetAllSubscriberOptions {
  sort?: QuerySort<SubscriberDAO>;
}

export interface CreateSubscriberPayload {
  subscriber: SubscriberDAO;
}

export interface UpdateSubscriberPayload {
  id: number;
  subscriber: SubscriberDAO;
}

export interface DeleteSubscriberPayload {
  id: number;
}
