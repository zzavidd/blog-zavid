import type { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import type { SubscriberDAO } from 'classes/subscribers/SubscriberDAO';
import { AlertType, reportError, setAlert } from 'components/alert';
import { UIError } from 'constants/errors';
import hooks from 'constants/handlers';
import type { PathDefinition } from 'constants/types';
import * as Utils from 'constants/utils';
import { checkValidSubscriber } from 'constants/validations';
import PageMetadata from 'fragments/PageMetadata';
import SubscriberForm, {
  buildPayload,
} from 'fragments/subscribers/SubscriberForm';
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';
import SSR from 'private/ssr';

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
> = async ({ query, req, res }) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);
  if (!session) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  const subscriber = JSON.parse(
    await SSR.Subscribers.getById(parseInt(query.id as string)),
  );
  return {
    props: {
      pathDefinition: {
        title: 'Edit Subscriber',
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
