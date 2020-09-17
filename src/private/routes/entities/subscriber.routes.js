const express = require('express');
const router = express.Router();

const { Subscriber, SubscriberQueryBuilder } = require('../../../classes');
const { siteTitle } = require('../../../constants/settings');
const { OPERATIONS } = require('../../../constants/strings');
const knex = require('../../singleton').getKnex();
const server = require('../../singleton').getServer();

router.get('/subscriptions/:token', function (req, res) {
  const { token } = req.params;
  new SubscriberQueryBuilder(knex)
    .whereToken(token)
    .build()
    .then(([subscriber]) => {
      if (!subscriber) return res.redirect('/');
      return server.render(req, res, '/subscribers/subscriptions', {
        title: `Subscription Preferences | ${siteTitle}`,
        subscriber: Subscriber.parse(subscriber)
      });
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
    operation: OPERATIONS.CREATE
  });
});

router.get('/admin/subscribers/edit/:id', function (req, res) {
  const { id } = req.params;
  new SubscriberQueryBuilder(knex)
    .whereId(id)
    .build()
    .then(([subscriber]) => {
      return server.render(req, res, '/subscribers/crud', {
        title: `Edit Subscriber`,
        operation: OPERATIONS.UPDATE,
        subscriber: Subscriber.parse(subscriber)
      });
    });
});

module.exports = router;
