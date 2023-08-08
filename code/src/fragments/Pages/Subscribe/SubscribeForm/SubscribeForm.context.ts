import type { Prisma } from '@prisma/client';
import React from 'react';

import { SubscriptionType } from 'utils/enum';

const initialSubscriptions = Object.values(SubscriptionType).reduce(
  (acc, type) => {
    acc[type] = true;
    return acc;
  },
  {} as SubscriptionMap,
);

export const InitialSubscribeFormState: SubscribeFormState = {
  subscriber: {
    email: '',
    firstname: '',
    lastname: '',
    subscriptions: initialSubscriptions,
    token: '',
  },
  isSubmitted: false,
};

export const SubscribeFormContext = React.createContext<
  ReactUseState<SubscribeFormState>
>([InitialSubscribeFormState, () => {}]);

interface SubscribeFormState {
  subscriber: Prisma.SubscriberCreateInput;
  isSubmitted: boolean;
}
