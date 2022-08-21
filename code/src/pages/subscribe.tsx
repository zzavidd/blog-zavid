import type { NextPage } from 'next';
import React, { useState } from 'react';

import type { SubscriberDAO } from 'classes';
import { SubscriberBuilder } from 'classes';
import { alert, reportError } from 'components/alert';
import { ConfirmButton } from 'components/button';
import { Field, FieldRow, Label, TextInput } from 'components/form';
import { Title } from 'components/text';
import PathDefinitions from 'constants/paths';
import PageMetadata from 'fragments/PageMetadata';
import { UIError } from 'lib/errors';
import hooks from 'lib/hooks';
import { checkValidSubscriber } from 'lib/validations';
import css from 'styles/pages/Subscribers.module.scss';

// eslint-disable-next-line react/function-component-definition
const SubscribeForm: NextPage = () => {
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
      checkValidSubscriber(subscriber);

      const payload = new SubscriberBuilder()
        .withEmail(subscriber.email)
        .withFirstName(subscriber.firstname)
        .withLastName(subscriber.lastname)
        .withDefaultSubscriptions()
        .build();

      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }
      alert.success(
        `Thank you for subscribing!\nI've added ${subscriber.email} to my mailing list.`,
      );
      setTimeout(() => (location.href = '/'), 2000);
    } catch (e: any) {
      if (e instanceof UIError) {
        reportError(e.message, true);
      } else if (e.message.includes('ER_DUP_ENTRY')) {
        alert.error('The email address you submitted already exists.');
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
      <PageMetadata {...PathDefinitions.Subscribe} />
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

export default SubscribeForm;
