import { z } from 'zod';

export const zCreateSubscriberPayload = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  subscriptions: z.object({
    Diary: z.boolean(),
    Reveries: z.boolean(),
  }),
});
