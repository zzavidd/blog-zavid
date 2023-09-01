import { z } from 'zod';

export const SubscriberOrderByRelevanceFieldEnumSchema = z.enum([
  'email',
  'firstname',
  'lastname',
  'token',
]);
