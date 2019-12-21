const express = require('express');
const app = express();

const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const config = process.env.LOCAL_ENV ? '../../config.env' : '/home/config.env';
const server = next({ dev });
const handle = server.getRequestHandler();

const bodyParser = require('body-parser');
const cors = require('cors');
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

app.get(['/', '/home'], function(req, res){
  server.render(req, res, '/home', { 
    title: 'ZAVID',
    description: 'Enter my complex world.',
    url: '/'
  });
});

app.get('/reveries', function(req, res){
  server.render(req, res, '/reveries', { 
    title: 'Reveries',
    description: 'For my deeper ruminations...',
    url: '/'
  });
});

app.get('/epistles', function(req, res){
  server.render(req, res, '/epistles', { 
    title: 'Reveries',
    description: 'My messages, written to encourage and enlighten; typically based off of Bible scriptures and transcribed as poetry. Read and be blessed.',
    url: '/'
  });
});