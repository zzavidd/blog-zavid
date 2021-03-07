import { useMutation } from '@apollo/client';
import { NextPageContext } from 'next';
import React, { useEffect, useState } from 'react';

import {
  Operation,
  SubscriberBuilder,
  SubscriberDAO,
  SubscriberPayload,
  SubscriberStatic,
  SubscriptionsMapping
} from 'classes';
import { setAlert, reportError, alert, AlertType } from 'src/components/alert';
import hooks from 'src/lib/hooks';
import SubscriberForm from 'src/lib/pages/subscribers/form';
import { DAOParse } from 'src/lib/parser';
import { isValidSubscriber } from 'src/lib/validations';
import {
  CREATE_SUBSCRIBER_QUERY,
  UPDATE_SUBSCRIBER_QUERY
} from 'src/private/api/queries/subscriber.queries';

const SubscriberCrud = ({
  subscriber: serverSubscriber,
  operation
}: SubscriberCrud) => {
  const [clientSubscriber, setSubscriber] = useState({
    id: 0,
    email: '',
    firstname: '',
    lastname: ''
  } as SubscriberDAO);
  const [preferences, setPreferences] = useState(
    SubscriberStatic.defaultSubscriptions()
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
  const isCreateOperation = operation === Operation.CREATE;

  /** Populate the form with subscriber details. */
  const populateForm = () => {
    if (isCreateOperation) return;
    setSubscriber(serverSubscriber);
    setPreferences(serverSubscriber.subscriptions as SubscriptionsMapping);
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
        alert.success(`You've successfully added a new subscriber.`);
        clearSubscriberForm();
      })
      .catch(reportError);
  };

  /** Update subscriber on server. */
  const updateSubscriber = () => {
    if (!isValidSubscriber(clientSubscriber)) return false;

    const variables = buildPayload(clientSubscriber, preferences, false);
    Promise.resolve()
      .then(() => updateSubscriberMutation({ variables }))
      .then(() => {
        setAlert({
          type: AlertType.SUCCESS,
          message: `You've successfully updated the subscriber with email: ${clientSubscriber.email}.`
        });
        returnToSubscriberAdmin();
      })
      .catch(reportError);
  };

  const clearSubscriberForm = () => {
    setSubscriber({ email: '', firstname: '', lastname: '' });
    setPreferences(SubscriberStatic.defaultSubscriptions());
  };

  return (
    <SubscriberForm
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

const buildPayload = (
  clientSubscriber: SubscriberDAO,
  subscriptions: SubscriptionsMapping,
  isCreateOperation: boolean
): SubscriberPayload => {
  const { id, email, firstname, lastname } = clientSubscriber;

  const subscriber = new SubscriberBuilder()
    .withEmail(email)
    .withFirstName(firstname)
    .withLastName(lastname)
    .withSubscriptions(subscriptions)
    .build();

  const payload: SubscriberPayload = { subscriber };
  if (!isCreateOperation) {
    payload.id = id;
  }

  return payload;
};

/** Return to the admin page. */
const returnToSubscriberAdmin = (): void => {
  location.href = '/admin/subscribers';
};

SubscriberCrud.getInitialProps = async ({ query }: NextPageContext) => {
  const subscriber = DAOParse<SubscriberDAO>(query.subscriber);
  const operation = query.operation as Operation;
  return { subscriber, operation };
};

export default SubscriberCrud;

interface SubscriberCrud {
  subscriber: SubscriberDAO;
  operation: Operation;
}
