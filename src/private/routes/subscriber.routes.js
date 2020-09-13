const express = require('express');
const router = express.Router();

const { OPERATIONS } = require('../../constants/strings');
const resolvers = require('../api/resolvers/subscriber.resolvers');
const server = require('../singleton').getServer();

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
  resolvers.Query.subscriber(undefined, { id }).then((subscriber) => {
    return server.render(req, res, '/subscribers/crud', {
      title: `Edit Subscriber`,
      operation: OPERATIONS.UPDATE,
      subscriber
    });
  });
});

module.exports = router;
