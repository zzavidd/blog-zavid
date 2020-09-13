const { v4: uuidv4 } = require('uuid');

const {
  Subscriber,
  SubscriberQueryBuilder,
  SubscriberMutationBuilder
} = require('../../../classes');
const { debug, ERRORS } = require('../../error');
const knex = require('../../singleton').getKnex();

const ENTITY_NAME = 'subscriber';

/**
 * Retrieves all subscriber from database.
 * @returns {object[]} The posts.
 */
const getAllSubscribers = () => {
  return Promise.resolve()
    .then(() => new SubscriberQueryBuilder(knex).build())
    .then((subscribers) => {
      return subscribers.map((subscriber) => Subscriber.parse(subscriber));
    })
    .catch(debug);
};

/**
 * Retrieves a single subscriber from database.
 * @param {object} parent Return value of the parent field.
 * @param {object} args The arguments.
 * @param {number} args.id The ID of the subscriber.
 * @returns {object[]} The posts.
 */
const getSingleSubscriber = (parent, { id }) => {
  return Promise.resolve()
    .then(() => new SubscriberQueryBuilder(knex).whereId(id).build())
    .then(([subscriber]) => {
      if (!subscriber) throw ERRORS.NONEXISTENT_ID(id, ENTITY_NAME);
      return Subscriber.parse(subscriber);
    })
    .catch(debug);
};

/**
 * Inserts a new subscriber into the database.
 * @param {object} parent Return value of the parent field.
 * @param {object} args - The arguments.
 * @param {object} args.subscriber - The subscriber object to be inserted.
 * @returns {number} The ID of the newly-created post.
 */
const createSubscriber = (parent, { subscriber }) => {
  return Promise.resolve()
    .then(() => {
      Object.assign(subscriber, {
        subscriptions: JSON.stringify(subscriber.subscriptions),
        token: uuidv4()
      });
      return new SubscriberMutationBuilder(knex).insert(subscriber).build();
    })
    .then(([id]) => ({ id }))
    .catch(debug);
};

/**
 * Updates the fields of a subscriber in the database.
 * @param {object} parent Return value of the parent field.
 * @param {object} args - The arguments.
 * @param {number} args.id - The ID of the subscriber to update.
 * @param {object} args.subscriber - The subscriber object to be updated.
 * @returns {object} The subscriber after being updated.
 */
const updateSubscriber = (parent, { id, subscriber }) => {
  return Promise.resolve()
    .then(() => {
      Object.assign(subscriber, {
        subscriptions: JSON.stringify(subscriber.subscriptions)
      });
      return new SubscriberMutationBuilder(knex)
        .update(subscriber)
        .whereId(id)
        .build();
    })
    .then(() => getSingleSubscriber(undefined, { id }))
    .catch(debug);
};

/**
 * Deletes a subscriber from the database.
 * @param {object} parent Return value of the parent field.
 * @param {object} args - The arguments.
 * @param {number} args.id - The ID of the subscriber to delete.
 * @returns {number} The ID of the deleted subscriber.
 */
const deleteSubscriber = (parent, { id }) => {
  return Promise.resolve()
    .then(() => new SubscriberQueryBuilder(knex).whereId(id).build())
    .then(([subscriber]) => {
      if (!subscriber) throw ERRORS.NONEXISTENT_ID(id, ENTITY_NAME);
      return new SubscriberMutationBuilder(knex).delete(id).build();
    })
    .then(() => ({ id }))
    .catch(debug);
};

module.exports = {
  Query: {
    subscribers: getAllSubscribers,
    subscriber: getSingleSubscriber
  },
  Mutation: {
    createSubscriber,
    updateSubscriber,
    deleteSubscriber
  }
};
