import type { zCreateSubscriberPayload } from 'utils/validators';
import type { z } from 'zod';

declare global {
  export type CreateSubscriberPayload = z.infer<
    typeof zCreateSubscriberPayload
  >;
}
