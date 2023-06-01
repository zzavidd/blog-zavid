import { initTRPC } from '@trpc/server';
import SuperJSON from 'superjson';

const QUERY_ERROR_MSG =
  'There was a problem retrieving data. Please try again later.';
const MUTATION_ERROR_MSG = 'There was a problem. Please try again later.';

const t = initTRPC.create({
  errorFormatter: ({ error, type, shape }) => {
    if (process.env.NEXT_PUBLIC_APP_ENV === 'production') {
      if (type === 'query') {
        shape.message = QUERY_ERROR_MSG;
      } else {
        shape.message = MUTATION_ERROR_MSG;
      }
    } else {
      if (shape.message.includes('email_UNIQUE')) {
        shape.message = 'This email address is already subscribed.';
      } else {
        shape.message = error.message;
      }
    }

    return shape;
  },
  transformer: SuperJSON,
});

export const router = t.router;
export const procedure = t.procedure;
