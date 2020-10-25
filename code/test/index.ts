require('dotenv').config({ path: './config.env' });
const { assert } = require('chai');
const { print } = require('graphql/language/printer');
const fetch = require('node-fetch');

exports.assert = assert;
exports.classes = require('../classes');
exports.debug = (err: Error) => {
  throw err;
};
exports.fetch = (query: any, options: FetchOptions = {}, test?: Function) => {
  const { variables = {}, expectToFail = false } = options;
  return fetch(`http://localhost:4000/api`, {
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

export {};
