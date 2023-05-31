import type { Prisma } from '@prisma/client';
import React from 'react';

export const InitialSubscribeFormState: SubscribeFormState = {
  subscriber: {
    email: '',
    firstname: '',
    lastname: '',
    subscriptions: {
      Diary: true,
      Reveries: true,
    },
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
