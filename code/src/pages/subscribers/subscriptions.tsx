import { useMutation } from '@apollo/client';
import { NextPageContext } from 'next';
import React, { useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';

import { SubscriberDAO, SubscriptionsMapping } from 'classes';
import { alert, setAlert, reportError, AlertType } from 'src/components/alert';
import { ConfirmButton, InvisibleButton } from 'src/components/button';
import { Container } from 'src/components/layout';
import { ConfirmModal } from 'src/components/modal';
import { Title } from 'src/components/text';
import PreferenceChecks from 'src/lib/pages/subscribers/preferences';
import { DAOParse } from 'src/lib/parser';
import {
  UPDATE_SUBSCRIBER_QUERY,
  DELETE_SUBSCRIBER_QUERY
} from 'src/private/api/queries/subscriber.queries';
import css from 'src/styles/pages/Subscribers.module.scss';

const SubscriptionPreferences = ({ subscriber }: SubscriptionsProps) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);

  const [preferences, setPreferences] = useState(
    subscriber.subscriptions as SubscriptionsMapping
  );
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
      .catch(reportError);
  };

  const unsubscribe = () => {
    const { id } = subscriber;
    Promise.resolve()
      .then(() => deleteSubscriberMutation({ variables: { id } }))
      .then(() => {
        setAlert({
          type: AlertType.SUCCESS,
          message: `You've successfully unsubscribed from my blog.`
        });
        setDeleteModalVisibility(false);
        location.href = '/';
      })
      .catch(reportError);
  };

  return (
    <>
      <Container>
        <Title className={css['pref-title']}>Subscription Preferences</Title>
        <div className={css['pref-email']}>{subscriber.email}</div>
        <div className={css['pref-checks-intro']}>
          You are subscribed to my:
        </div>
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

SubscriptionPreferences.getInitialProps = async ({
  query
}: NextPageContext) => {
  const subscriber = DAOParse<SubscriberDAO>(query.subscriber);
  return { subscriber };
};

export default SubscriptionPreferences;

interface SubscriptionsProps {
  subscriber: SubscriberDAO;
}
