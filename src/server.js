const express = require('express');
const app = express();

const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const config = process.env.LOCAL_ENV ? '../../config.env' : '/home/config.env';
const server = next({ dev });
const handle = server.getRequestHandler();

const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const dotenv = require('dotenv').config({path: config });
const port = parseInt(process.env.PORT, 10) || 3000;

app.use(bodyParser.json({ limit: '2MB' }));
app.use(cors());

server.prepare().then(() => {
	app.get('*', (req, res) => handle(req, res));
	app.listen(port, (err) => {
		if (err) throw err;
		console.log(`ZAVID server running on http://localhost:${port}`);
	});
});

/** Initialise MySQL database */
const conn = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PWD,
  database: process.env.MYSQL_NAME,
});

conn.connect(err => {
  console.log(err ? err.toString() : 'Connected to ZAVID database.');
});

require('./private/api.js')(app, conn);
require('./private/routes.js')(app, conn, server);