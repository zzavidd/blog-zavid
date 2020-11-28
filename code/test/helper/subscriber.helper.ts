import { validate as uuidValidate } from 'uuid';

import {
  createEntity,
  deleteEntity,
  getEntities,
  getSingleEntity,
  SubmitEntityResponse,
  updateEntity
} from '.';
import { assert, Variables } from '..';
import { SubscriberDAO } from '../../classes';
import {
  CREATE_SUBSCRIBER_QUERY,
  DELETE_SUBSCRIBER_QUERY,
  GET_SINGLE_SUBSCRIBER_QUERY,
  GET_SUBSCRIBERS_QUERY,
  UPDATE_SUBSCRIBER_QUERY
} from '../../src/private/api/queries/subscriber.queries';

const ENTITY_NAME = 'subscriber';

export const getSubscribers = (variables?: Variables): Promise<SubscriberDAO[]> => {
  return getEntities({
    query: GET_SUBSCRIBERS_QUERY,
    resolver: 'subscribers',
    variables
  });
};

export const getSingleSubscriber = (
  id: number,
  expectToFail?: boolean
): Promise<SubscriberDAO> => {
  return getSingleEntity(id, {
    query: GET_SINGLE_SUBSCRIBER_QUERY,
    resolver: 'subscriber',
    expectToFail
  });
};

export const createSubscriber = (
  subscriber: SubscriberDAO
): Promise<SubmitEntityResponse> => {
  return createEntity(subscriber, {
    query: CREATE_SUBSCRIBER_QUERY,
    resolver: 'createSubscriber',
    anonym: ENTITY_NAME
  });
};

export const updateSubscriber = (
  id: number,
  subscriber: SubscriberDAO
): Promise<SubscriberDAO> => {
  return updateEntity(id, subscriber, {
    query: UPDATE_SUBSCRIBER_QUERY,
    resolver: 'updateSubscriber',
    anonym: ENTITY_NAME
  });
};

export const deleteSubscriber = (id: number): Promise<void> => {
  return deleteEntity(id, {
    query: DELETE_SUBSCRIBER_QUERY,
    resolver: 'deleteSubscriber',
    verifyDelete: async () => await getSingleSubscriber(id, true)
  });
};

export const compareSubscribers = (
  request: SubscriberDAO,
  response: SubscriberDAO
) => {
  assert.strictEqual(request.email, response.email);
  assert.strictEqual(request.firstname, response.firstname);
  assert.strictEqual(request.lastname, response.lastname);
  assert.deepStrictEqual(request.subscriptions, response.subscriptions);
  assert.isTrue(uuidValidate(response.token!));
};
