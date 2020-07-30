const express = require('express');
const router = express.Router();

const { siteTitle } = require('../../constants/settings');

const server = require('../singleton/server').getServer();

/**
 * Reveries page
 * @route {GET} /reveries
 */
router.get('/reveries', function (req, res) {
  return server.render(req, res, '/reveries', {
    title: `Reveries | ${siteTitle}`,
    description: 'For my deeper ruminations...',
    url: '/reveries'
  });
});

/**
 * Epistles page
 * @route {GET} /epistles
 */
router.get('/epistles', function (req, res) {
  return server.render(req, res, '/epistles', {
    title: `Epistles | ${siteTitle}`,
    description:
      'My messages, written to encourage and enlighten; typically based off of Bible scriptures and transcribed as poetry. Read and be blessed.',
    url: '/epistles'
  });
});

module.exports = router;