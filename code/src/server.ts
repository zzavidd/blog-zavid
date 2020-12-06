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

import 'colors';

const isStaging = process.argv.includes('--staging');

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
if (dotenv.error && !process.env.PORT) {
  throw new Error(`No environment variables loaded.`);
}

// Warn if using production database. Prohibit if running tests.
if (!process.env.MYSQL_NAME?.includes('test')){
  console.warn('WARNING: Using production data.'.yellow);
  if (isStaging){
    throw new Error(`Failsafe disallows tests being run against production data.`);
  }
}

// If not in CI environment, start server normally.
if (!isStaging) {
  startDevServer();
}

/** Start server for development. */
async function startDevServer() {
  startServer();
}

/**
 * Start server for running service tests.
 * @param finish The callback called after running the server.
 */
function startStagingServer(finish: () => void) {
  startServer({ callback: finish });
}

/**
 * Starts the server.
 * @param options The options for starting the server.
 */
async function startServer(options: ServerOptions = {}) {
  const { isFullServer = true, callback } = options;

  setApp(app);
  setKnex(knex);
  setServer(server);

  await import('./private/api');

  if (isFullServer) {
    await import('./private/routes');
  }

  server.prepare().then(() => {
    app.get('*', (req, res) => handle(req, res));
    app
      .listen(port, '0.0.0.0', () => {
        console.info(`ZAVID server running on http://localhost:${port}`);
        if (callback) callback();
      })
      .on('error', (err) => {
        if (err) throw err;
      });
  });
}

export { startStagingServer };

type ServerOptions = {
  isFullServer?: boolean;
  callback?: () => void;
};
