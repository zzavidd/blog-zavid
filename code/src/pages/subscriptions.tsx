import type { GetServerSideProps, NextPage } from 'next';
import React, { useState } from 'react';
import type { RootStateOrAny } from 'react-redux';
import { useSelector } from 'react-redux';

import type { SubscriberDAO, SubscriptionsMapping } from 'classes';
import { SubscriberBuilder } from 'classes';
import { alert, AlertType, reportError, setAlert } from 'components/alert';
import { ConfirmButton, InvisibleButton } from 'components/button';
import { Container } from 'components/layout';
import { ConfirmModal } from 'components/modal';
import { Title } from 'components/text';
import PathDefinitions from 'constants/paths';
import PageMetadata from 'fragments/PageMetadata';
import PreferenceChecks from 'lib/pages/subscribers/preferences';
import css from 'styles/pages/Subscribers.module.scss';

import { getSubscriberByTokenSSR } from './api/subscribers';

// eslint-disable-next-line react/function-component-definition
const SubscriptionPreferences: NextPage<SubscriptionsProps> = ({
  subscriber,
}) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);

  const [preferences, setPreferences] = useState(
    subscriber.subscriptions as SubscriptionsMapping,
  );
  const [deleteModalVisible, setDeleteModalVisibility] = useState(false);

  async function updateSubscriptionPreferences() {
    try {
      const { id, firstname, lastname, email } = subscriber;
      const payload = {
        id,
        subscriber: new SubscriberBuilder()
          .withEmail(email)
          .withFirstName(firstname)
          .withLastName(lastname)
          .withSubscriptions(preferences)
          .build(),
      };

      const res = await fetch('/api/subscribers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }
      alert.success(
        `You've successfully updated your subscription preferences.`,
      );
    } catch (e: any) {
      reportError(e.message);
    }
  }

  async function unsubscribe() {
    try {
      const res = await fetch('/api/subscribers', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: subscriber.id }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }
      setAlert({
        type: AlertType.SUCCESS,
        message: `You've successfully unsubscribed from my blog.`,
      });
      setDeleteModalVisibility(false);
      location.href = '/';
    } catch (e: any) {
      reportError(e.message);
    }
  }

  return (
    <React.Fragment>
      <PageMetadata {...PathDefinitions.SubscriptionPreferences} />
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
    </React.Fragment>
  );
};

export const getServerSideProps: GetServerSideProps<
  SubscriptionsProps
> = async ({ query }) => {
  return {
    props: {
      subscriber: JSON.parse(
        await getSubscriberByTokenSSR(query.token as string),
      ),
    },
  };
};

export default SubscriptionPreferences;

interface SubscriptionsProps {
  subscriber: SubscriberDAO;
}
