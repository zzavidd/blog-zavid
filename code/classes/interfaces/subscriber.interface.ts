export interface SubscriberDAO {
  id?: number;
  email?: string;
  firstname?: string;
  lastname?: string;
  subscriptions?: SubscriptionsMapping | string;
  token?: string;
}

export interface SubscriptionsMapping {
  [type: string]: boolean
}

export enum SubscriptionType {
  Reverie = 'Reveries',
  Diary = 'Diary'
}