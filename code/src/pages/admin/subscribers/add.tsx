import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

import type {
  SubscriberDAO,
  SubscriberPayload,
  SubscriptionsMapping,
} from 'classes';
import { SubscriberBuilder, SubscriberStatic } from 'classes';
import { alert, reportError } from 'components/alert';
import type { PathDefinition } from 'constants/paths';
import * as Utils from 'constants/utils';
import { UIError } from 'lib/errors';
import hooks from 'lib/hooks';
import SubscriberForm from 'lib/pages/subscribers/form';
import { checkValidSubscriber } from 'lib/validations';

// eslint-disable-next-line react/function-component-definition
const SubscriberAdd: NextPage<SubscriberAddProps> = () => {
  const [clientSubscriber, setSubscriber] = useState<SubscriberDAO>({
    email: '',
    firstname: '',
    lastname: '',
    subscriptions: SubscriberStatic.defaultSubscriptions(),
  });
  const [isRequestPending, setRequestPending] = useState(false);

  const router = useRouter();

  /** Create new subscriber on server. */
  async function submitSubscriber() {
    try {
      checkValidSubscriber(clientSubscriber, true);

      const payload = buildPayload(clientSubscriber, true);
      await Utils.request('/api/subscribers', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      alert.success(`You've successfully added a new subscriber.`);
      clearSubscriberForm();
    } catch (e: any) {
      reportError(e.message, e instanceof UIError);
    } finally {
      setRequestPending(false);
    }
  }

  function clearSubscriberForm() {
    setSubscriber({
      email: '',
      firstname: '',
      lastname: '',
      subscriptions: SubscriberStatic.defaultSubscriptions(),
    });
  }

  function returnToAdmin() {
    void router.push('/admin/subscribers');
  }

  return (
    <SubscriberForm
      subscriber={clientSubscriber}
      handlers={hooks(setSubscriber, clientSubscriber)}
      confirmFunction={submitSubscriber}
      confirmButtonText={'Submit'}
      cancelFunction={returnToAdmin}
      isRequestPending={isRequestPending}
    />
  );
};

function buildPayload(
  clientSubscriber: SubscriberDAO,
  isCreateOperation: boolean,
): SubscriberPayload {
  const { id, email, firstname, lastname, subscriptions } = clientSubscriber;

  const subscriber = new SubscriberBuilder()
    .withEmail(email)
    .withFirstName(firstname)
    .withLastName(lastname)
    .withSubscriptions(subscriptions as SubscriptionsMapping)
    .build();

  const payload: SubscriberPayload = { subscriber };
  if (!isCreateOperation) {
    payload.id = id;
  }

  return payload;
}

export default SubscriberAdd;

interface SubscriberAddProps {
  pathDefinition: PathDefinition;
  pageProps: {
    subscriber: SubscriberDAO;
  };
}
