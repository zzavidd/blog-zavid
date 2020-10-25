/* eslint-disable import/order */
const express = require('express');
const app = express();

const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const server = next({ dev });
const handle = server.getRequestHandler();

const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv').config({ path: './config.env' });
const port = parseInt(process.env.PORT, 10) || 4000;

app.use(bodyParser.json({ limit: '2MB' }));
app.use(cors());

const { setApp, setKnex, setServer } = require('./private/singleton');

// Initialise MySQL database
const knex = require('knex')({
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
    app.listen(port, '0.0.0.0', (err) => {
      if (err) throw err;
      console.info(`ZAVID server running on http://localhost:${port}`);
    });
  });
}
