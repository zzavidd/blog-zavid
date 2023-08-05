import immutate from 'immutability-helper';
import type { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';

import Layout from 'fragments/Layout';
import Subscriptions from 'fragments/Pages/Subscribe/Subscriptions/Subscriptions';
import {
  InitialSubscriptionsState,
  SubscriptionsContext,
} from 'fragments/Pages/Subscribe/Subscriptions/Subscriptions.context';
import { SubscriptionType } from 'utils/enum';
import Logger from 'utils/logger';
import Settings from 'utils/settings';
import { getServerSideHelpers } from 'utils/ssr';
import { trpc } from 'utils/trpc';

const SubscriptionPreferences: NextPageWithLayout<SubscriptionsProps> = ({
  token,
}) => {
  const [state, setState] = useState(InitialSubscriptionsState);
  const { data: subscriber } = trpc.subscriber.find.useQuery({
    where: { token },
  });

  useEffect(() => {
    if (!subscriber) return;

    const subscriptions = {} as SubscriptionMap;
    Object.values(SubscriptionType).forEach((type) => {
      subscriptions[type] =
        (subscriber.subscriptions as SubscriptionMap)[type] ?? false;
    });

    setState((s) =>
      immutate(s, {
        subscriber: {
          $set: { ...subscriber, subscriptions },
        },
      }),
    );
  }, [subscriber]);

  return (
    <SubscriptionsContext.Provider value={[state, setState]}>
      <Subscriptions />
    </SubscriptionsContext.Provider>
  );
};

export const getServerSideProps: GetServerSideProps<
  SubscriptionsProps
> = async (ctx) => {
  try {
    const { query, res } = ctx;
    const token = String(query.token);

    const helpers = getServerSideHelpers(ctx);
    await helpers.subscriber.find.prefetch({ where: { token } });

    res.setHeader('X-Robots-Tag', 'noindex');

    return {
      props: {
        token,
        pathDefinition: {
          title: `Subscription Preferences | ${Settings.SITE_TITLE}`,
        },
      },
    };
  } catch (e) {
    Logger.error(e);
    return { notFound: true };
  }
};

SubscriptionPreferences.getLayout = Layout.addPartials;
export default SubscriptionPreferences;

interface SubscriptionsProps extends AppPageProps {
  token: string;
}
