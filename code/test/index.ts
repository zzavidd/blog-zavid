import { assert } from 'chai';
import * as dotenv from 'dotenv';
import { DocumentNode } from 'graphql';
import { print } from 'graphql/language/printer';
import 'mocha';
import nodeFetch from 'node-fetch';

dotenv.config({ path: './.env' });

// Start the server when in staging environment.
if (process.env.CI) {
  (async () => {
    const server = await import('../server');
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
export async function fetch(
  query: DocumentNode,
  options: FetchOptions = {},
): Promise<FetchResponse | undefined> {
  const { variables = {}, expectToFail = false } = options;
  try {
    const res = await nodeFetch(`http://localhost:4000/api`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: print(query), variables }),
    });
    const { data, errors } = await res.json();
    if (!expectToFail) {
      assert.isNotOk(errors);
      assert.isOk(data);
    }
    return { data, errors };
  } catch (err) {
    debug(err);
  }
}

/**
 * A wrapper for Mocha tests which handles exceptions.
 * @param testBody The body of the test to be executed.
 */
export function testWrapper(testBody: () => void): () => Promise<void> {
  return async () => {
    try {
      await testBody();
    } catch (err) {
      debug(err);
    }
  };
}

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

export type FetchOptions = {
  variables?: Variables;
  expectToFail?: boolean;
};

export type FetchResponse = {
  data?: Record<string, unknown>;
  errors?: Record<string, unknown>;
};

export type Variables = {
  id?: number;
  isPublish?: boolean;
  isTest?: boolean;
  [entity: string]: unknown;
};
