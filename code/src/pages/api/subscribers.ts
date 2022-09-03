import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

import type { QuerySort } from 'classes/_/QueryBuilder';
import type { SubscriberDAO } from 'classes/subscribers/SubscriberDAO';
import { SubscriberMutationBuilder } from 'classes/subscribers/SubscriberQueryBuilder';
import { knex } from 'constants/knex';
import SubscriberAPI from 'private/api/subscribers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
): Promise<void> {
  try {
    switch (req.method) {
      case 'GET': {
        await SubscriberAPI.getAll();
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
