import express from 'express';

import {
  SubscriberStatic,
  SubscriberQueryBuilder,
  Operation
} from '../../../../classes';
import { siteTitle } from '../../../constants/settings';
import { getKnex, getServer } from '../../singleton';

const router = express.Router();
const knex = getKnex();
const server = getServer();

router.get('/subscriptions/:token', async function (req, res) {
  const { token } = req.params;

  const [subscriber] = await new SubscriberQueryBuilder(knex)
    .whereToken(token)
    .build();
  if (!subscriber) return res.redirect('/');
  return server.render(req, res, '/subscribers/subscriptions', {
    title: `Subscription Preferences | ${siteTitle}`,
    subscriber: JSON.stringify(SubscriberStatic.parse(subscriber))
  });
});

router.get('/subscribe', function (req, res) {
  return server.render(req, res, '/subscribers/subscribe', {
    title: `Subscribe | ${siteTitle}`,
    ogUrl: '/subscribe'
  });
});

router.get('/admin/subscribers', function (req, res) {
  return server.render(req, res, '/subscribers/admin', {
    title: `List of Subscribers`
  });
});

router.get('/admin/subscribers/add', function (req, res) {
  return server.render(req, res, '/subscribers/crud', {
    title: `Add New Subscriber`,
    operation: Operation.CREATE
  });
});

router.get('/admin/subscribers/edit/:id', async function (req, res) {
  const id = parseInt(req.params.id);
  const [subscriber] = await new SubscriberQueryBuilder(knex)
    .whereId(id)
    .build();
  return server.render(req, res, '/subscribers/crud', {
    title: `Edit Subscriber`,
    operation: Operation.UPDATE,
    subscriber: JSON.stringify(SubscriberStatic.parse(subscriber))
  });
});

export default router;
