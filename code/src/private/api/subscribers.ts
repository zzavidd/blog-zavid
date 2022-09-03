import type { SubscriberDAO } from 'classes/subscribers/SubscriberDAO';
import { SubscriberQueryBuilder } from 'classes/subscribers/SubscriberQueryBuilder';
import { SubscriberStatic } from 'classes/subscribers/SubscriberStatic';
import { knex } from 'constants/knex';
import type { GetAllSubscriberOptions } from 'pages/api/subscribers';

namespace SubscriberAPI {
  /**
   * Retrieves all subscriber from database.
   * @param args.sort The sort options.
   */
  export async function getAll(
    options: GetAllSubscriberOptions = {},
  ): Promise<SubscriberDAO[]> {
    const { sort = {} } = options;
    const subscribers = await new SubscriberQueryBuilder(knex)
      .withOrder(sort)
      .build();
    return subscribers.map(SubscriberStatic.parse);
  }

  export async function getByToken(token: string): Promise<SubscriberDAO> {
    const [subscriber] = await new SubscriberQueryBuilder(knex)
      .whereToken(token)
      .build();
    return SubscriberStatic.parse(subscriber);
  }

  export async function getById(id: number): Promise<SubscriberDAO> {
    const [subscriber] = await new SubscriberQueryBuilder(knex)
      .whereId(id)
      .build();
    return SubscriberStatic.parse(subscriber);
  }
}

export default SubscriberAPI;
