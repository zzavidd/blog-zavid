import * as dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import { print } from 'graphql/language/printer';
import { assert } from 'chai';
import nodeFetch from 'node-fetch';

export * as classes from '../classes';
export { assert };
export const debug = (err: Error) => {
  throw err;
};
export const fetch = (
  query: any,
  options: FetchOptions = {},
  test?: Function
) => {
  const { variables = {}, expectToFail = false } = options;
  return nodeFetch(`http://localhost:4000/api`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: print(query), variables })
  })
    .then((res: any) => res.json())
    .then((response: { data?: any; errors?: any }) => {
      const { data, errors } = response;
      if (!expectToFail) {
        assert.isNotOk(errors);
        assert.isOk(data);
      }
      if (test) return test({ data, errors });
    })
    .catch(console.error);
};

interface FetchOptions {
  variables?: any;
  expectToFail?: true;
}
