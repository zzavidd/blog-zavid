interface SubscriberDAO {
  id?: number;
  email: string;
  firstname?: string;
  lastname?: string;
  subscriptions?: SubscriptionsMapping | string;
  token?: string;
  createTime?: Date;
}

interface SubscriptionsMapping {
  [type: string]: boolean;
}

interface SubscriberPayload {
  id?: number;
  subscriber: SubscriberDAO;
}

type SubscriptionType = 'Reveries' | 'Diary';
