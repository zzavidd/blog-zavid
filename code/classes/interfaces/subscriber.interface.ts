import { GenericDAO } from './super';

export interface SubscriberDAO extends GenericDAO {
  email?: string;
  firstname?: string;
  lastname?: string;
  subscriptions?: SubscriptionsMapping | string;
  token?: string;
}

export interface SubscriptionsMapping {
  [type: string]: boolean;
}

export enum SubscriptionType {
  Reverie = 'Reveries',
  Diary = 'Diary'
}

export interface SubscriberPayload {
  id?: number;
  subscriber: SubscriberDAO;
}
