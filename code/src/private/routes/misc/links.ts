import express from 'express';
import request from 'request';

import { cloudinaryBaseUrl } from '../../../settings';
const router = express.Router();

router.get('/resources/university-thrival-guide', function (req, res) {
  const url = `${cloudinaryBaseUrl}/v1601812122/static/docs/university-thrival-guide.pdf`;
  request(url).pipe(res);
});

router.get('/resources/dissertation', function (req, res) {
  const url = `${cloudinaryBaseUrl}/v1601812127/static/docs/dissertation.pdf`;
  request(url).pipe(res);
});

router.get('/images/zavid-filter/purple', function (req, res) {
  const url = `${cloudinaryBaseUrl}/static/bg/zavid-filter-purple.jpg`;
  request(url).pipe(res);
});

export default router;