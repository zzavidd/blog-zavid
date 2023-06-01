import { z } from 'zod';

export const zSubscribeForm = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
});
