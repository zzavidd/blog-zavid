import { useMutation } from '@apollo/client';
import React, { useState } from 'react';

import { setAlert } from 'components/alert';
import { DeleteButton } from 'components/button';
import { Container } from 'components/layout';
import { ConfirmModal } from 'components/modal';
import { Title } from 'components/text';
import { DELETE_SUBSCRIBER_QUERY } from 'private/api/queries/subscriber.queries';
import css from 'styles/pages/Subscribers.module.scss';

const SubscriptionPreferences = ({ subscriber }) => {
  const [deleteModalVisible, setDeleteModalVisibility] = useState(false);
  const [deleteSubscriberMutation] = useMutation(DELETE_SUBSCRIBER_QUERY);

  const unsubscribe = () => {
    const { id } = subscriber;
    Promise.resolve()
      .then(() => deleteSubscriberMutation({ variables: { id } }))
      .then(() => {
        setAlert({
          type: 'success',
          message: `You've successfully unsubscribed from my blog.`
        });
        setDeleteModalVisibility(false);
        location.href = '/';
      })
      .catch(console.error);
  };

  return (
    <>
      <Container>
        <Title className={css['pref-title']}>Subscription Preferences</Title>
        <div>Email Address: {subscriber.email}</div>
        <DeleteButton onClick={() => setDeleteModalVisibility(true)}>
          Unsubscribe
        </DeleteButton>
      </Container>
      <ConfirmModal
        visible={deleteModalVisible}
        message={`Are you sure you want to unsubscribe?`}
        confirmFunction={unsubscribe}
        confirmText={'Yes, I want to unsubscribe'}
        closeFunction={() => setDeleteModalVisibility(false)}
      />
    </>
  );
};

SubscriptionPreferences.getInitialProps = async ({ query }) => {
  return { ...query };
};

export default SubscriptionPreferences;
