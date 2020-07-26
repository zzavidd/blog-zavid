const assert = require('assert');

let IApp;

/**
 * Set the instance of the app.
 * @param {object} instance - The app instance.
 */
exports.setApp = (instance) => {
  IApp = instance;
};

/**
 * Retrieve the app singleton instance.
 * @returns {object} The app instance.
 */
exports.getApp = () => {
  assert.ok(IApp, 'App has not been initialized.');
  return IApp;
};