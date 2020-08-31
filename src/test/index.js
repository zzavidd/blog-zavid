const { assert } = require('chai');
const { print } = require('graphql/language/printer');
const fetch = require('node-fetch');

exports.assert = assert;
exports.debug = (err) => {
  throw err;
};
exports.fetch = (query, options = {}, test) => {
  const { variables = {}, expectToFail = false } = options;
  return fetch(`http://localhost:4000/api`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: print(query), variables })
  })
    .then((res) => {
      assert.equal(res.status, 200);
      return res.json();
    })
    .then(({ data, errors }) => {
      if (!expectToFail) {
        assert.isNotOk(errors);
        assert.isOk(data);
      }
      return test({ data, errors });
    })
    .catch(console.error);
};
