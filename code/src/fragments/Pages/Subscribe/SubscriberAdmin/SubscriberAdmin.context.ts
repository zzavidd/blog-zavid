import type { Prisma, Subscriber } from '@prisma/client';
import React from 'react';

export const InitialSubscriberAdminState: SubscriberAdminState = {
  isDeleteModalVisible: false,
  isMenuVisible: false,
  menuAnchor: null,
  selectedSubscriber: null,
  sort: {
    property: 'createTime',
    order: 'desc',
  },
};

export const SubscriberAdminContext = React.createContext<
  ReactUseState<SubscriberAdminState>
>([InitialSubscriberAdminState, () => {}]);

interface SubscriberAdminState {
  isDeleteModalVisible: boolean;
  isMenuVisible: boolean;
  menuAnchor: HTMLButtonElement | null;
  selectedSubscriber: Subscriber | null;
  sort: {
    property: keyof Subscriber;
    order: Prisma.SortOrder;
  };
}
