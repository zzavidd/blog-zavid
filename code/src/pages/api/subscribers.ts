import type { NextApiRequest, NextApiResponse } from 'next';

import type { QuerySort, SubscriberDAO } from 'classes';
import { SubscriberQueryBuilder, SubscriberStatic } from 'classes';
import { knex } from 'src/private/db';
import { debug } from 'src/private/error';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
): Promise<void> {
  if (req.method === 'GET') {
    const json = await getAllSubscribers();
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
  options: GetAllSubscriberOptions = {}
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

export interface GetAllSubscriberOptions {
  sort?: QuerySort;
}
