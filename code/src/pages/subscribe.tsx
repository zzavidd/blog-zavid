import type { GetStaticProps, NextPage } from 'next';
import React, { useState } from 'react';

import { SubscriberBuilder } from 'classes/subscribers/SubscriberBuilder';
import type { SubscriberDAO } from 'classes/subscribers/SubscriberDAO';
import { Alert, reportError } from 'components/alert';
import { ConfirmButton } from 'components/button';
import { Field, FieldRow, Label, TextInput } from 'components/form';
import { Title } from 'components/text';
import { UIError } from 'constants/errors';
import hooks from 'constants/handlers';
import { SITE_TITLE } from 'constants/settings';
import type { AppPageProps } from 'constants/types';
import Utils from 'constants/utils';
import Validate from 'constants/validations';
import PageMetadata from 'fragments/PageMetadata';
import css from 'styles/pages/Subscribers.module.scss';

// eslint-disable-next-line react/function-component-definition
const SubscribePage: NextPage<AppPageProps> = ({ pathDefinition }) => {
  const [subscriber, setSubscriber] = useState({
    email: '',
    firstname: '',
    lastname: '',
  } as SubscriberDAO);
  const [isRequestPending, setRequestPending] = useState(false);

  /** Create new subscriber on server. */
  async function submitSubscriber() {
    setRequestPending(true);

    try {
      Validate.subscriber(subscriber);

      const payload = new SubscriberBuilder()
        .withEmail(subscriber.email)
        .withFirstName(subscriber.firstname)
        .withLastName(subscriber.lastname)
        .withDefaultSubscriptions()
        .build();

      const res = await Utils.request('/api/subscribers', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }
      Alert.success(
        `Thank you for subscribing!\nI've added ${subscriber.email} to my mailing list.`,
      );
      setTimeout(() => (location.href = '/'), 2000);
    } catch (e: any) {
      if (e instanceof UIError) {
        reportError(e.message, true);
      } else if (e.message.includes('ER_DUP_ENTRY')) {
        Alert.error('The email address you submitted already exists.');
      } else {
        reportError(e.message);
      }
    } finally {
      setRequestPending(false);
    }
  }

  const { handleText } = hooks(setSubscriber, subscriber);

  return (
    <React.Fragment>
      <PageMetadata {...pathDefinition} />
      <div className={css['user-subscribe-form']}>
        <Title className={css['user-subscribe-title']}>
          Subscribe to the ZAVID Blog
        </Title>
        <div className={css['user-subscribe-message']}>
          And never miss a diary entry nor a post.
        </div>
        <FieldRow>
          <Field>
            <Label>Email:</Label>
            <TextInput
              name={'email'}
              value={subscriber.email!}
              onChange={handleText}
              placeholder={'Enter your email address'}
            />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field md={6}>
            <Label>First Name:</Label>
            <TextInput
              name={'firstname'}
              value={subscriber.firstname!}
              onChange={handleText}
              placeholder={'(Optional) Enter your first name'}
            />
          </Field>
          <Field md={6}>
            <Label>Last Name:</Label>
            <TextInput
              name={'lastname'}
              value={subscriber.lastname!}
              onChange={handleText}
              placeholder={'(Optional) Enter your last name'}
            />
          </Field>
        </FieldRow>
        <FieldRow>
          <ConfirmButton
            onClick={submitSubscriber}
            isRequestPending={isRequestPending}
            className={css['user-subscribe-button']}>
            Submit
          </ConfirmButton>
        </FieldRow>
      </div>
    </React.Fragment>
  );
};

export const getStaticProps: GetStaticProps<AppPageProps> = () => {
  return {
    props: {
      pathDefinition: {
        title: `Subscribe | ${SITE_TITLE}`,
        description:
          'Be the first to know when a new post or diary entry drops.',
        url: '/subscribe',
      },
    },
  };
};

export default SubscribePage;
