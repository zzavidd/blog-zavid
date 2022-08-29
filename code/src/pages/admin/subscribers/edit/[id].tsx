import { DAOParse } from 'lib/parser';
import type { NextPageContext } from 'next';
import React, { useEffect, useState } from 'react';

import type {
  SubscriberDAO,
  SubscriberPayload,
  SubscriptionsMapping,
} from 'classes';
import { Operation, SubscriberBuilder, SubscriberStatic } from 'classes';
import { setAlert, reportError, alert, AlertType } from 'components/alert';
import hooks from 'lib/hooks';
import SubscriberForm from 'lib/pages/subscribers/form';
import { checkValidSubscriber } from 'lib/validations';

function SubscriberCrud({
  subscriber: serverSubscriber,
  operation,
}: SubscriberCrud) {
  const [clientSubscriber, setSubscriber] = useState({
    id: 0,
    email: '',
    firstname: '',
    lastname: '',
  } as SubscriberDAO);
  const [preferences, setPreferences] = useState(
    SubscriberStatic.defaultSubscriptions(),
  );
  const [isRequestPending, setRequestPending] = useState(false);

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
    if (!checkValidSubscriber(clientSubscriber, true)) return false;

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
    if (!checkValidSubscriber(clientSubscriber)) return false;

    const variables = buildPayload(clientSubscriber, preferences, false);
    Promise.resolve()
      .then(() => updateSubscriberMutation({ variables }))
      .then(() => {
        setAlert({
          type: AlertType.SUCCESS,
          message: `You've successfully updated the subscriber with email: ${clientSubscriber.email}.`,
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
}

const buildPayload = (
  clientSubscriber: SubscriberDAO,
  subscriptions: SubscriptionsMapping,
  isCreateOperation: boolean,
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

interface SubscriberEditProps {
  pathDefinition: PathDefinition;
  pageProps: {
    subscriber: SubscriberDAO;
  };
}
