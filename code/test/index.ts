import * as dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import { print } from 'graphql/language/printer';
import { assert } from 'chai';
import nodeFetch from 'node-fetch';

export { assert };
export const debug = (err: Error) => {
  throw err;
};
export const fetch = (query: any, options: FetchOptions = {}) => {
  const { variables = {}, expectToFail = false } = options;
  return nodeFetch(`http://localhost:4000/api`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: print(query), variables })
  })
    .then((res) => res.json())
    .then((response: FetchResponse = {}) => {
      const { data, errors } = response;
      if (!expectToFail) {
        assert.isNotOk(errors);
        assert.isOk(data);
      }
      return { data, errors };
    })
    .catch(console.error);
};

export const testWrapper = (testBody: Function) => {
  return async () => {
    try {
      await testBody();
    } catch (err) {
      throw err;
    }
  };
};

export interface FetchOptions {
  variables?: any;
  expectToFail?: boolean;
}

export interface FetchResponse {
  data?: any;
  errors?: any;
}
