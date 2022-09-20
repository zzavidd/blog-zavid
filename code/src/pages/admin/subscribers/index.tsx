import type { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import type {
  SubscriberDAO,
  SubscriptionsMapping,
} from 'classes/subscribers/SubscriberDAO';
import { AdminButton, InvisibleButton } from 'components/button';
import { Spacer, Toolbar } from 'components/layout';
import {
  Icon,
  Tabler,
  TablerColumnHeader as TCH,
  TablerFieldType,
  TablerItemCell as TIC,
} from 'components/library';
import { ConfirmModal } from 'components/modal';
import Alert from 'constants/alert';
import type {
  NextPageWithLayout,
  PathDefinition,
  ReactHook,
} from 'constants/types';
import { QueryOrder } from 'constants/types';
import Utils from 'constants/utils';
import Layout from 'fragments/Layout';
import PageMetadata from 'fragments/PageMetadata';
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';
import SSR from 'private/ssr';

// eslint-disable-next-line react/function-component-definition
const SubscribersAdmin: NextPageWithLayout<SubscribersAdminProps> = ({
  pathDefinition,
  pageProps,
}) => {
  const { subscribers } = pageProps;
  const router = useRouter();

  const [selectedSubscriber, setSelectedSubscriber] = useState<SubscriberDAO>(
    {},
  );
  const [deleteModalVisible, setDeleteModalVisibility] = useState(false);

  async function deleteSubscriber() {
    const { id, email } = selectedSubscriber;

    try {
      await Utils.request('/api/subscribers', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      Alert.success(`You've deleted the subscriber with email: ${email}.`);
      router.reload();
      setDeleteModalVisibility(false);
    } catch (e: any) {
      reportError(e.message);
    }
  }

  function navigateToCreateForm() {
    void router.push('/admin/subscribers/add');
  }

  function navigateToEditForm(id: number) {
    void router.push(`/admin/subscribers/edit/${id}`);
  }

  return (
    <React.Fragment>
      <PageMetadata {...pathDefinition} />
      <Spacer>
        <Tabler<7>
          heading={'List of Subscribers'}
          itemsLoaded={true}
          emptyMessage={'No subscribers found.'}
          columns={[
            new TCH('#', { centerAlign: true }),
            new TCH('Email'),
            new TCH('First Name'),
            new TCH('Last Name'),
            new TCH('Subscriptions'),
          ]}
          items={subscribers.map((subscriber: SubscriberDAO, key: number) => {
            return [
              new TIC(subscribers.length - key, {
                type: TablerFieldType.INDEX,
              }),
              new TIC(subscriber.email, { icon: 'at' }),
              new TIC(subscriber.firstname, {
                icon: 'user',
                hideIfEmpty: true,
              }),
              new TIC(subscriber.lastname, {
                icon: 'user',
                hideIfEmpty: true,
              }),
              new TIC(
                showSubscriptionPreferences(
                  subscriber.subscriptions as SubscriptionsMapping,
                ),
                { icon: 'check-square', hideIfEmpty: true },
              ),
              new TIC(
                (
                  <InvisibleButton
                    onClick={() => navigateToEditForm(subscriber.id!)}>
                    <Icon name={'pen-alt'} />
                  </InvisibleButton>
                ),
                {
                  type: TablerFieldType.BUTTON,
                },
              ),
              new TIC(
                (
                  <DeleteButton
                    subscriber={subscriber}
                    key={key}
                    setDeleteModalVisibility={setDeleteModalVisibility}
                    setSelectedSubscriber={setSelectedSubscriber}
                  />
                ),
                { type: TablerFieldType.BUTTON },
              ),
            ];
          })}
          distribution={['6%', '1fr', '0.7fr', '0.7fr', '30%', '4%', '4%']}
        />
        <Toolbar>
          <AdminButton onClick={navigateToCreateForm}>
            Add New Subscriber
          </AdminButton>
        </Toolbar>
      </Spacer>
      <ConfirmModal
        visible={deleteModalVisible}
        message={`Are you sure you want to delete the subscriber with email **${selectedSubscriber.email}**?`}
        confirmFunction={deleteSubscriber}
        confirmText={'Delete'}
        closeFunction={() => setDeleteModalVisibility(false)}
      />
    </React.Fragment>
  );
};

function showSubscriptionPreferences(subscriptions: SubscriptionsMapping) {
  return (
    <React.Fragment>
      {Object.entries(subscriptions)
        .filter(([key]) => !key.startsWith('_'))
        .map(([label, checked], key) => {
          if (checked) {
            return (
              <div key={key}>
                <Icon name={'check'} />
                {label}
              </div>
            );
          }
        })}
    </React.Fragment>
  );
}

function DeleteButton({
  subscriber,
  setDeleteModalVisibility,
  setSelectedSubscriber,
}: DeleteButton) {
  const attemptDelete = () => {
    setDeleteModalVisibility(true);
    setSelectedSubscriber(subscriber);
  };

  return (
    <InvisibleButton onClick={attemptDelete}>
      <Icon name={'trash'} />
    </InvisibleButton>
  );
}

export const getServerSideProps: GetServerSideProps<
  SubscribersAdminProps
> = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);
  if (!session) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  const subscribers = JSON.parse(
    await SSR.Subscribers.getAll({
      sort: {
        field: 'createTime',
        order: QueryOrder.DESCENDING,
      },
    }),
  );
  return {
    props: {
      pathDefinition: {
        title: 'List of Subscribers',
      },
      pageProps: {
        subscribers,
      },
    },
  };
};

SubscribersAdmin.getLayout = Layout.addHeaderOnly;
export default SubscribersAdmin;

interface SubscribersAdminProps {
  pathDefinition: PathDefinition;
  pageProps: {
    subscribers: SubscriberDAO[];
  };
}

interface DeleteButton {
  subscriber: SubscriberDAO;
  setDeleteModalVisibility: (event: boolean) => void;
  setSelectedSubscriber: ReactHook<SubscriberDAO>;
}
