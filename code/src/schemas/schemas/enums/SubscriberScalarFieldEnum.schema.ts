import { z } from 'zod';

export const SubscriberScalarFieldEnumSchema = z.enum([
  'id',
  'email',
  'firstname',
  'lastname',
  'subscriptions',
  'token',
  'createTime',
]);
