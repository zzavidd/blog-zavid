import type { EntityDAO } from '../entity';

export interface SubscriberDAO extends EntityDAO {
  email?: string;
  firstname?: string;
  lastname?: string;
  subscriptions?: SubscriptionsMapping | string;
  token?: string;
  createTime?: Date;
}

export interface SubscriptionsMapping {
  [type: string]: boolean;
}

export enum SubscriptionType {
  Reverie = 'Reveries',
  Diary = 'Diary',
}

export interface SubscriberPayload {
  id?: number;
  subscriber: SubscriberDAO;
}
