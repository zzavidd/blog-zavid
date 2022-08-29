import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import type { SubscriberDAO } from 'classes';
import { AlertType, reportError, setAlert } from 'components/alert';
import type { PathDefinition } from 'constants/paths';
import * as Utils from 'constants/utils';
import PageMetadata from 'fragments/PageMetadata';
import SubscriberForm, {
  buildPayload,
} from 'fragments/subscribers/SubscriberForm';
import { UIError } from 'lib/errors';
import hooks from 'lib/hooks';
import { checkValidSubscriber } from 'lib/validations';
import { getSubscriberByIdSSR } from 'pages/api/subscribers';

function SubscriberEdit({ pathDefinition, pageProps }: SubscriberEditProps) {
  const { subscriber: serverSubscriber } = pageProps;
  const [clientSubscriber, setSubscriber] =
    useState<SubscriberDAO>(serverSubscriber);
  const [isRequestPending, setRequestPending] = useState(false);

  const router = useRouter();

  /** Update subscriber on server. */
  async function updateSubscriber() {
    try {
      checkValidSubscriber(clientSubscriber, true);
      setRequestPending(true);

      const payload = buildPayload(clientSubscriber, false);
      await Utils.request('/api/subscribers', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      setAlert({
        type: AlertType.SUCCESS,
        message: `You've successfully updated the subscriber with email: ${clientSubscriber.email}.`,
      });
      returnToAdmin();
    } catch (e: any) {
      reportError(e.message, e instanceof UIError);
    } finally {
      setRequestPending(false);
    }
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
        confirmFunction={updateSubscriber}
        confirmButtonText={'Update'}
        cancelFunction={returnToAdmin}
        isRequestPending={isRequestPending}
      />
    </React.Fragment>
  );
}

export const getServerSideProps: GetServerSideProps<
  SubscriberEditProps
> = async ({ query }) => {
  const subscriber = JSON.parse(
    await getSubscriberByIdSSR(parseInt(query.id as string)),
  );
  return {
    props: {
      pathDefinition: {
        title: `Edit Subscriber`,
      },
      pageProps: {
        subscriber,
      },
    },
  };
};

export default SubscriberEdit;

interface SubscriberEditProps {
  pathDefinition: PathDefinition;
  pageProps: {
    subscriber: SubscriberDAO;
  };
}