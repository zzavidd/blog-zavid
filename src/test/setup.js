const { assert } = require('chai');
const { print } = require('graphql/language/printer');
const fetch = require('node-fetch');

// const Singleton = require('../private/singleton');

// before(function (done) {
//   Singleton.startTestServer(done);
// });

// after(function () {
//   setTimeout(() => process.exit(0), 2000);
// });

exports.assert = assert;
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
