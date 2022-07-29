import { ApolloServer } from 'apollo-server-express';
import type { AsyncResultCallback } from 'async';
import async from 'async';
import fs from 'fs';
import path from 'path';

import { getApp } from '../singleton';

import resolvers from './resolvers';

const app = getApp();

const schemaFilenames = fs.readdirSync(path.join(__dirname, 'schema'));

async.map(
  schemaFilenames,
  function (filename: string, callback: AsyncResultCallback<string, Error>) {
    fs.readFile(
      path.join(__dirname, `schema/${filename}`),
      { encoding: 'utf-8' },
      function (err, data) {
        callback(err, data!);
      },
    );
  },
  function (err: CallbackError, typeDefs) {
    if (err) throw err;

    const apolloServer = new ApolloServer({
      typeDefs: typeDefs as string[],
      resolvers,
    });

    apolloServer.applyMiddleware({ app, path: '/api' });
  },
);

type CallbackError = Error | null | undefined;
