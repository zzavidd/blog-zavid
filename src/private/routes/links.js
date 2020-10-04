const express = require('express');
const router = express.Router();

const request = require('request');

const { cloudinaryBaseUrl } = require('../../constants/settings');

router.get('/resources/university-thrival-guide', function (req, res) {
  const url = `${cloudinaryBaseUrl}/v1601812122/static/docs/university-thrival-guide.pdf`;
  request(url).pipe(res);
});

router.get('/resources/dissertation', function (req, res) {
  const url = `${cloudinaryBaseUrl}/v1601812127/static/docs/dissertation.pdf`;
  request(url).pipe(res);
});

module.exports = router;