import bodyParser from 'body-parser';
import cors from 'cors';
import * as Dotenv from 'dotenv';
import express from 'express';
import Knex from 'knex';
import next from 'next';

import { setApp, setKnex, setServer } from './private/singleton';

const app = express();
const dev = process.env.NODE_ENV !== 'production';
const server = next({ dev });
const handle = server.getRequestHandler();
const port = parseInt(process.env.PORT!, 10) || 4000;
const dotenv = Dotenv.config({ path: './config.env' });

app.use(bodyParser.json({ limit: '2MB' }));
app.use(cors());

const knex = Knex({
  client: 'mysql',
  connection: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database: process.env.MYSQL_NAME
  }
});

// Check for loaded environment variables
if (dotenv.error) {
  throw new Error(`No environment variables loaded.`);
}

startServer();

require('./private/api');
require('./private/routes');

function startServer() {
  setApp(app);
  setKnex(knex);
  setServer(server);

  server.prepare().then(() => {
    app.get('*', (req, res) => handle(req, res));
    app
      .listen(port, '0.0.0.0', () => {
        console.info(`ZAVID server running on http://localhost:${port}`);
      })
      .on('error', (err) => {
        if (err) throw err;
      });
  });
}
