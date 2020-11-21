import { ApolloServer } from 'apollo-server-express';
import async from 'async';

import fs from 'fs';
import path from 'path';

import resolvers from './resolvers';

import { getApp } from '../singleton';

const app = getApp();

const schemaFilenames = fs.readdirSync(path.join(__dirname, 'schema'));

async.map(
  schemaFilenames,
  function (filename, callback) {
    fs.readFile(
      path.join(__dirname, `schema/${filename}`),
      { encoding: 'utf-8' },
      function (err, data) {
        callback(err, data);
      }
    );
  },
  function (err, typeDefs: string[]) {
    if (err) throw err;

    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers
    });

    apolloServer.applyMiddleware({ app, path: '/api' });
  }
);
