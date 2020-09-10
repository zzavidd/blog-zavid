const { ApolloServer } = require('apollo-server-express');
const async = require('async');

const fs = require('fs');
const path = require('path');

const resolvers = require('./resolvers');

const app = require('../singleton').getApp();

const schemaFilenames = ['post'];

async.map(
  schemaFilenames,
  function (filename, callback) {
    fs.readFile(
      path.join(__dirname, `schema/${filename}.schema.gql`),
      { encoding: 'utf-8' },
      function (err, data) {
        callback(err, data);
      }
    );
  },
  function (err, typeDefs) {
    if (err) throw err;

    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers
    });

    apolloServer.applyMiddleware({ app, path: '/api' });
  }
);
