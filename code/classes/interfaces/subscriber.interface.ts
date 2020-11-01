export interface SubscriberDAO {
  email?: string;
  firstname?: string;
  lastname?: string;
  subscriptions?: SubscriptionsMapping | string;
}

export interface SubscriptionsMapping {
  [type: string]: boolean
}

export enum SubscriptionType {
  Reverie = 'Reveries',
  Diary = 'Diary'
}