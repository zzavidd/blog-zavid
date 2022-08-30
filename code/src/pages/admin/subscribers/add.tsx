import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import type { SubscriberDAO } from 'classes';
import { SubscriberStatic } from 'classes';
import { alert, reportError } from 'components/alert';
import { UIError } from 'constants/errors';
import hooks from 'constants/handlers';
import type { PathDefinition } from 'constants/types';
import * as Utils from 'constants/utils';
import { checkValidSubscriber } from 'constants/validations';
import PageMetadata from 'fragments/PageMetadata';
import SubscriberForm, {
  buildPayload,
} from 'fragments/subscribers/SubscriberForm';

// eslint-disable-next-line react/function-component-definition
const SubscriberAdd: NextPage<SubscriberAddProps> = ({ pathDefinition }) => {
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
      setRequestPending(true);

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
    <React.Fragment>
      <PageMetadata {...pathDefinition} />
      <SubscriberForm
        subscriber={clientSubscriber}
        handlers={hooks(setSubscriber, clientSubscriber)}
        confirmFunction={submitSubscriber}
        confirmButtonText={'Submit'}
        cancelFunction={returnToAdmin}
        isRequestPending={isRequestPending}
      />
    </React.Fragment>
  );
};

export const getStaticProps: GetStaticProps<SubscriberAddProps> = () => {
  return {
    props: {
      pathDefinition: {
        title: `Add New Subscriber`,
      },
    },
  };
};

export default SubscriberAdd;

interface SubscriberAddProps {
  pathDefinition: PathDefinition;
}
