import { NetworkStatus, useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';

import { alert, reportError } from 'components/alert';
import { AdminButton, InvisibleButton } from 'components/button';
import { Icon } from 'components/icon';
import { Spacer, Toolbar } from 'components/layout';
import { ConfirmModal } from 'components/modal';
import Tabler, { TYPE } from 'components/tabler';
import {
  GET_SUBSCRIBERS_QUERY,
  DELETE_SUBSCRIBER_QUERY
} from 'private/api/queries/subscriber.queries';

export default () => {
  const [subscribers, setSubscribers] = useState([]);
  const [selectedSubscriber, setSelectedSubscriber] = useState({});
  const [isLoaded, setLoaded] = useState(false);
  const [deleteModalVisible, setDeleteModalVisibility] = useState(false);

  const {
    data,
    error: queryError,
    loading: queryLoading,
    refetch,
    networkStatus
  } = useQuery(GET_SUBSCRIBERS_QUERY, {
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
    const { id, email } = selectedSubscriber;
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
            ['#', { centerAlign: true }],
            ['Email'],
            ['First Name'],
            ['Last Name'],
            ['Subscriptions']
          ]}
          items={subscribers.map((subscriber, key) => {
            return [
              [key + 1, { type: TYPE.INDEX }],
              [subscriber.email, { icon: 'at' }],
              [subscriber.firstname, { icon: 'user', hideIfEmpty: true }],
              [subscriber.lastname, { icon: 'user', hideIfEmpty: true }],
              [
                showSubscriptionPreferences(subscriber.subscriptions),
                { icon: 'check-square', hideIfEmpty: true }
              ],
              [
                <EditButton id={subscriber.id} key={key} />,
                { type: TYPE.BUTTON }
              ],
              [
                <DeleteButton
                  subscriber={subscriber}
                  key={key}
                  setDeleteModalVisibility={setDeleteModalVisibility}
                  setSelectedSubscriber={setSelectedSubscriber}
                />,
                { type: TYPE.BUTTON }
              ]
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

const showSubscriptionPreferences = (subscriptions) => {
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

const navigateToCreateForm = () => {
  location.href = '/admin/subscribers/add';
};

const EditButton = ({ id }) => {
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
}) => {
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
