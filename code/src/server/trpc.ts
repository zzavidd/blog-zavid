import { initTRPC } from '@trpc/server';

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
      shape.message = error.message;
    }

    return shape;
  },
});

export const router = t.router;
export const procedure = t.procedure;
