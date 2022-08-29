import { fetch } from '../..';
import { SubscriberBuilder } from '../../../classes';
import { CREATE_SUBSCRIBER_QUERY } from '../../../private/api/queries/subscriber.queries';
import { COUNT } from '../constants';

const quantity = COUNT.SUBSCRIBERS;

export async function ingestSubscribers() {
  console.info(`Ingesting ${quantity} subscribers...`);

  const promises = [];

  for (let i = 0; i < quantity; i++) {
    const subscriber = new SubscriberBuilder().random().build();

    promises.push(
      fetch(CREATE_SUBSCRIBER_QUERY, {
        variables: { subscriber },
      }),
    );
  }

  await Promise.all(promises);
  console.info('Finished ingesting subscribers.');
}
