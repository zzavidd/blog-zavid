import { useMutation } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { alert, setAlert } from 'components/alert';
import { ConfirmButton, InvisibleButton } from 'components/button';
import { Checkbox } from 'components/form/checkbox';
import { Container } from 'components/layout';
import { ConfirmModal } from 'components/modal';
import { Title } from 'components/text';
import {
  UPDATE_SUBSCRIBER_QUERY,
  DELETE_SUBSCRIBER_QUERY
} from 'private/api/queries/subscriber.queries';
import css from 'styles/pages/Subscribers.module.scss';

const SubscriptionPreferences = ({ subscriber }) => {
  const theme = useSelector(({ theme }) => theme);

  const [preferences, setPreferences] = useState(subscriber.subscriptions);
  const [deleteModalVisible, setDeleteModalVisibility] = useState(false);
  const [updateSubscriberMutation] = useMutation(UPDATE_SUBSCRIBER_QUERY);
  const [deleteSubscriberMutation] = useMutation(DELETE_SUBSCRIBER_QUERY);

  const updateSubscriptionPreferences = () => {
    const { id, firstname, lastname, email } = subscriber;
    const variables = {
      id,
      subscriber: {
        firstname,
        lastname,
        email,
        subscriptions: preferences
      }
    };

    Promise.resolve()
      .then(() => updateSubscriberMutation({ variables }))
      .then(() => {
        alert.success(
          `You've successfully updated your subscription preferences.`
        );
      })
      .catch(alert.error);
  };

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
        <div className={css['pref-email']}>{subscriber.email}</div>
        <PreferenceChecks
          preferences={preferences}
          setPreferences={setPreferences}
        />
        <ConfirmButton
          onClick={updateSubscriptionPreferences}
          className={css['pref-update-button']}>
          Update Preferences
        </ConfirmButton>
        <InvisibleButton
          onClick={() => setDeleteModalVisibility(true)}
          className={css[`pref-unsubscribe-button-${theme}`]}>
          Unsubscribe
        </InvisibleButton>
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

const PreferenceChecks = ({ preferences, setPreferences }) => {
  const checkPreference = (e) => {
    const { name, checked } = e.target;
    setPreferences(
      Object.assign({}, preferences, {
        [name]: checked
      })
    );
  };

  const checks = Object.entries(preferences).map(([label, checked], key) => {
    return (
      <Checkbox
        key={key}
        name={label}
        label={label}
        checked={checked}
        onChange={checkPreference}
      />
    );
  });
  return (
    <div className={css['pref-checks']}>
      <div className={css['pref-checks-intro']}>You are subscribed to:</div>
      <div className={css['pref-checks-checkboxes']}>{checks}</div>
    </div>
  );
};

SubscriptionPreferences.getInitialProps = async ({ query }) => {
  return { ...query };
};

export default SubscriptionPreferences;
