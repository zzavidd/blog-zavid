import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';

import { SubscriberBuilder, SubscriberDAO, SubscriberPayload } from 'classes';
import { alert, reportError } from 'src/components/alert';
import { ConfirmButton } from 'src/components/button';
import { Field, FieldRow, Label, TextInput } from 'src/components/form';
import { Title } from 'src/components/text';
import { Fader } from 'src/components/transitioner';
import hooks from 'src/lib/hooks';
import { isValidSubscriber } from 'src/lib/validations';
import { CREATE_SUBSCRIBER_QUERY } from 'src/private/api/queries/subscriber.queries';
import css from 'src/styles/pages/Subscribers.module.scss';

export default () => {
  const [subscriber, setSubscriber] = useState({
    email: '',
    firstname: '',
    lastname: ''
  } as SubscriberDAO);
  const [isLoaded, setLoaded] = useState(false);
  const [isRequestPending, setRequestPending] = useState(false);

  // Initialise mutation functions.
  const [createSubscriberMutation, { loading: createLoading }] = useMutation(
    CREATE_SUBSCRIBER_QUERY
  );

  useEffect(() => {
    setLoaded(true);
  }, [isLoaded]);

  useEffect(() => {
    setRequestPending(createLoading);
  }, [createLoading]);

  /** Create new subscriber on server. */
  const submitSubscriber = () => {
    if (!isValidSubscriber(subscriber)) return false;

    const variables = buildPayload(subscriber);
    Promise.resolve()
      .then(() => createSubscriberMutation({ variables }))
      .then(() => {
        alert.success(
          `Thank you for subscribing!\nI've added ${subscriber.email} to my mailing list.`
        );
        setTimeout(() => (location.href = '/'), 2000);
      })
      .catch(({ message: error }) => {
        if (error.includes('ER_DUP_ENTRY')) {
          alert.error('The email address you submitted already exists.');
        } else {
          reportError(error);
        }
      });
  };

  const { handleText } = hooks(setSubscriber, subscriber);

  return (
    <Fader
      determinant={isLoaded}
      duration={500}
      className={css['user-subscribe-form']}>
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
    </Fader>
  );
};

const buildPayload = (clientSubscriber: SubscriberDAO): SubscriberPayload => {
  const { email, firstname, lastname } = clientSubscriber;

  const subscriber = new SubscriberBuilder()
    .withEmail(email)
    .withFirstName(firstname)
    .withLastName(lastname)
    .withDefaultSubscriptions()
    .build();

  return { subscriber };
};
