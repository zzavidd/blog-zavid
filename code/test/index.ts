import { assert } from 'chai';
import * as dotenv from 'dotenv';
import { DocumentNode } from 'graphql';
import { print } from 'graphql/language/printer';
import nodeFetch from 'node-fetch';

dotenv.config({ path: './config.env' });

export { assert };

/**
 * Prints error message and exits.
 * @param err The error to be displayed to console.
 */
export const debug = (err: Error) => {
  console.error(err);
  process.exit(0);
};

/**
 * Sends a request to the server.
 * @param query The GraphQL query.
 * @param options Options for fetching.
 */
export const fetch = (query: DocumentNode, options: FetchOptions = {}) => {
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
    .catch(debug);
};

/**
 * A wrapper for Mocha tests which handles exceptions.
 * @param testBody The body of the test to be executed.
 */
export const testWrapper = (testBody: () => void): Mocha.AsyncFunc => {
  return async () => {
    try {
      testBody();
    } catch (err) {
      debug(err);
    }
  };
};

/**
 * A wrapper for promises with asynchronous bodies.
 * @param promiseBody The body of the promise.
 */
export const promiseWrapper = (promiseBody: () => void): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      await promiseBody();
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

export interface FetchOptions {
  variables?: any;
  expectToFail?: boolean;
}

export interface FetchResponse {
  data?: any;
  errors?: any;
}

// TODO: Strictly type test files