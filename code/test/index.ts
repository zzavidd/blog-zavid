import { assert } from 'chai';
import * as dotenv from 'dotenv';
import { DocumentNode } from 'graphql';
import { print } from 'graphql/language/printer';
import nodeFetch from 'node-fetch';
import 'mocha';

dotenv.config({ path: './config.env' });

// Start the server when in staging environment.
if (process.argv.includes('--staging')) {
  (async () => {
    const server = await import('../src/server');
    before(function (done) {
      console.info('Starting server to run tests.');
      server.startStagingServer(done);
    });
  })();

  after(function () {
    setTimeout(() => process.exit(0), 1500);
  });
}

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
      await testBody();
    } catch (err) {
      debug(err);
    }
  };
};

/**
 * A wrapper for promises with asynchronous bodies.
 * @param promiseBody The body of the promise.
 */
export async function promiseWrapper(promiseBody: () => void): Promise<void> {
  try {
    await promiseBody();
  } catch (err) {
    debug(err);
  }
}

export interface FetchOptions {
  variables?: any;
  expectToFail?: boolean;
}

export interface FetchResponse {
  data?: any;
  errors?: any;
}

// TODO: Strictly type test files
