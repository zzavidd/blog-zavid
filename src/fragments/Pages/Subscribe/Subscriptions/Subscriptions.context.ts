import type { Prisma } from '@prisma/client';
import React from 'react';

export const InitialSubscriptionsState: SubscriptionsState = {
  subscriber: {},
  isDeleteModalVisible: false,
  isUnsubscribeComplete: false,
};

export const SubscriptionsContext = React.createContext<
  ReactUseState<SubscriptionsState>
>([InitialSubscriptionsState, () => {}]);

interface SubscriptionsState {
  subscriber: Prisma.SubscriberUpdateInput;
  isDeleteModalVisible: boolean;
  isUnsubscribeComplete: boolean;
}
