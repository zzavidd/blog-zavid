import { NetworkStatus, useMutation, useQuery } from '@apollo/client';
import { NextPageContext } from 'next';
import React, { useEffect, useState } from 'react';

import {
  EditButton,
  QueryOrder,
  ReactHook,
  SubscriberDAO,
  SubscriptionsMapping
} from 'classes';
import { alert, reportError } from 'src/components/alert';
import { AdminButton, InvisibleButton } from 'src/components/button';
import { Icon } from 'src/components/icon';
import { Spacer, Toolbar } from 'src/components/layout';
import { ConfirmModal } from 'src/components/modal';
import Tabler, {
  TablerColumnHeader,
  TablerItemCell,
  TablerType
} from 'src/components/tabler';
import {
  GET_SUBSCRIBERS_QUERY,
  DELETE_SUBSCRIBER_QUERY
} from 'src/private/api/queries/subscriber.queries';

const SubscriberAdmin = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [selectedSubscriber, setSelectedSubscriber] = useState(
    {} as SubscriberDAO
  );
  const [isLoaded, setLoaded] = useState(false);
  const [deleteModalVisible, setDeleteModalVisibility] = useState(false);

  const {
    data,
    error: queryError,
    loading: queryLoading,
    refetch,
    networkStatus
  } = useQuery(GET_SUBSCRIBERS_QUERY, {
    variables: {
      sort: {
        field: 'createTime',
        order: QueryOrder.DESCENDING
      }
    },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true
  });
  const [deleteSubscriberMutation] = useMutation(DELETE_SUBSCRIBER_QUERY);

  useEffect(() => {
    if (networkStatus === NetworkStatus.refetch) return;
    if (queryLoading) return;
    if (queryError) alert.error(queryError);

    setSubscribers(data ? data.subscribers : []);
    setLoaded(true);
  }, [queryLoading, networkStatus]);

  const deleteSubscriber = () => {
    const { id, email }: SubscriberDAO = selectedSubscriber;
    Promise.resolve()
      .then(() => deleteSubscriberMutation({ variables: { id } }))
      .then(() => {
        alert.success(`You've deleted the subscriber with email: ${email}.`);
        setDeleteModalVisibility(false);
        refetch();
      })
      .catch(reportError);
  };

  return (
    <>
      <Spacer>
        <Tabler
          heading={'List of Subscribers'}
          itemsLoaded={
            isLoaded && !queryLoading && networkStatus !== NetworkStatus.refetch
          }
          emptyMessage={'No subscribers found.'}
          columns={[
            new TablerColumnHeader('#', { centerAlign: true }),
            new TablerColumnHeader('Email'),
            new TablerColumnHeader('First Name'),
            new TablerColumnHeader('Last Name'),
            new TablerColumnHeader('Subscriptions')
          ]}
          items={subscribers.map((subscriber: SubscriberDAO, key: number) => {
            return [
              new TablerItemCell(subscribers.length - key, {
                type: TablerType.INDEX
              }),
              new TablerItemCell(subscriber.email, { icon: 'at' }),
              new TablerItemCell(subscriber.firstname, {
                icon: 'user',
                hideIfEmpty: true
              }),
              new TablerItemCell(subscriber.lastname, {
                icon: 'user',
                hideIfEmpty: true
              }),
              new TablerItemCell(
                showSubscriptionPreferences(
                  subscriber.subscriptions as SubscriptionsMapping
                ),
                { icon: 'check-square', hideIfEmpty: true }
              ),
              new TablerItemCell(<EditButton id={subscriber.id!} key={key} />, {
                type: TablerType.BUTTON
              }),
              new TablerItemCell(
                (
                  <DeleteButton
                    subscriber={subscriber}
                    key={key}
                    setDeleteModalVisibility={setDeleteModalVisibility}
                    setSelectedSubscriber={setSelectedSubscriber}
                  />
                ),
                { type: TablerType.BUTTON }
              )
            ];
          })}
          distribution={'6% 1fr 0.7fr 0.7fr 30% 4% 4%'}
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
    </>
  );
};

const showSubscriptionPreferences = (subscriptions: SubscriptionsMapping) => {
  return (
    <>
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
    </>
  );
};

const navigateToCreateForm = (): void => {
  location.href = '/admin/subscribers/add';
};

const EditButton = ({ id }: EditButton) => {
  const navigateToLink = () =>
    (location.href = `/admin/subscribers/edit/${id}`);
  return (
    <InvisibleButton onClick={navigateToLink}>
      <Icon name={'pen-alt'} />
    </InvisibleButton>
  );
};

const DeleteButton = ({
  subscriber,
  setDeleteModalVisibility,
  setSelectedSubscriber
}: DeleteButton) => {
  const attemptDelete = () => {
    setDeleteModalVisibility(true);
    setSelectedSubscriber(subscriber);
  };

  return (
    <InvisibleButton onClick={attemptDelete}>
      <Icon name={'trash'} />
    </InvisibleButton>
  );
};

SubscriberAdmin.getInitialProps = async ({ query }: NextPageContext) => {
  return { ...query };
};

export default SubscriberAdmin;

interface DeleteButton {
  subscriber: SubscriberDAO;
  setDeleteModalVisibility: (event: boolean) => void;
  setSelectedSubscriber: ReactHook<SubscriberDAO>;
}
