/* eslint-disable jsdoc/require-returns */
import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';

import { Subscriber } from 'classes/static';
import { alert, setAlert } from 'components/alert';
import hooks from 'constants/hooks';
import { OPERATIONS } from 'constants/strings';
import { isValidSubscriber } from 'constants/validations';
import SubscriberForm from 'lib/helpers/pages/subscribers/form';
import {
  CREATE_SUBSCRIBER_QUERY,
  UPDATE_SUBSCRIBER_QUERY
} from 'private/api/queries/subscriber.queries';

const SubscriberCrud = ({ subscriber: serverSubscriber, operation }) => {
  const [clientSubscriber, setSubscriber] = useState({
    id: 0,
    email: '',
    firstname: '',
    lastname: ''
  });
  const [preferences, setPreferences] = useState(
    Subscriber.defaultSubscriptions()
  );
  const [isLoaded, setLoaded] = useState(false);
  const [isRequestPending, setRequestPending] = useState(false);

  // Initialise mutation functions.
  const [createSubscriberMutation, { loading: createLoading }] = useMutation(
    CREATE_SUBSCRIBER_QUERY
  );
  const [updateSubscriberMutation, { loading: updateLoading }] = useMutation(
    UPDATE_SUBSCRIBER_QUERY
  );

  // Determine operation type.
  const isCreateOperation = operation === OPERATIONS.CREATE;

  /** Populate the form with subscriber details. */
  const populateForm = () => {
    if (isCreateOperation) return;
    setSubscriber(serverSubscriber);
    setPreferences(serverSubscriber.subscriptions);
  };

  useEffect(() => {
    populateForm();
    setLoaded(true);
  }, [isLoaded]);

  useEffect(() => {
    setRequestPending(createLoading || updateLoading);
  }, [createLoading, updateLoading]);

  /** Create new subscriber on server. */
  const submitSubscriber = () => {
    if (!isValidSubscriber(clientSubscriber, true)) return false;

    const variables = buildPayload(clientSubscriber, preferences, true);
    Promise.resolve()
      .then(() => createSubscriberMutation({ variables }))
      .then(() => {
        setAlert({
          type: 'success',
          message: `You've successfully added a new subscriber.`
        });
        returnToSubscriberAdmin();
      })
      .catch(alert.error);
  };

  /** Update subscriber on server. */
  const updateSubscriber = () => {
    if (!isValidSubscriber(clientSubscriber)) return false;

    const variables = buildPayload(clientSubscriber, preferences, false);
    Promise.resolve()
      .then(() => updateSubscriberMutation({ variables }))
      .then(() => {
        setAlert({
          type: 'success',
          message: `You've successfully updated the subscriber with email: ${clientSubscriber.email}.`
        });
        returnToSubscriberAdmin();
      })
      .catch(alert.error);
  };

  return (
    <SubscriberForm
      isLoaded={isLoaded}
      subscriber={clientSubscriber}
      preferences={preferences}
      handlers={{ ...hooks(setSubscriber, clientSubscriber), setPreferences }}
      confirmFunction={isCreateOperation ? submitSubscriber : updateSubscriber}
      confirmButtonText={isCreateOperation ? 'Submit' : 'Update'}
      cancelFunction={returnToSubscriberAdmin}
      isRequestPending={isRequestPending}
    />
  );
};

/**
 * Builds the payload to send via the request.
 * @param {object} clientSubscriber The subscriber from state.
 * @param {boolean} isCreateOperation Indicates if operation is create or update.
 * @returns {object} The subscriber to submit.
 */
const buildPayload = (clientSubscriber, subscriptions, isCreateOperation) => {
  const { id, email, firstname, lastname } = clientSubscriber;

  const subscriber = {
    email: email.trim(),
    firstname: firstname.trim(),
    lastname: lastname.trim(),
    subscriptions
  };

  const payload = { subscriber };
  if (!isCreateOperation) {
    payload.id = id;
  }

  return payload;
};

/** Return to the admin page. */
const returnToSubscriberAdmin = () => {
  location.href = '/admin/subscribers';
};

SubscriberCrud.getInitialProps = async ({ query }) => {
  return { ...query };
};

export default SubscriberCrud;
