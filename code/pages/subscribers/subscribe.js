import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';

import { Subscriber } from 'classes';
import { alert, reportError } from 'components/alert';
import { ConfirmButton } from 'components/button';
import { FieldRow, Field, Label, TextInput } from 'components/form';
import { Title } from 'components/text';
import { Fader } from 'components/transitioner';
import hooks from 'constants/hooks';
import { isValidSubscriber } from 'constants/validations';
import { CREATE_SUBSCRIBER_QUERY } from 'private/api/queries/subscriber.queries';
import css from 'styles/pages/Subscribers.module.scss';

export default () => {
  const [subscriber, setSubscriber] = useState({
    email: '',
    firstname: '',
    lastname: ''
  });
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
            value={subscriber.email}
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
            value={subscriber.firstname}
            onChange={handleText}
            placeholder={'(Optional) Enter your first name'}
          />
        </Field>
        <Field md={6}>
          <Label>Last Name:</Label>
          <TextInput
            name={'lastname'}
            value={subscriber.lastname}
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

/**
 * Builds the payload to send via the request.
 * @param {object} clientSubscriber The subscriber from state.
 * @returns {object} The subscriber to submit.
 */
const buildPayload = (clientSubscriber) => {
  const { email, firstname, lastname } = clientSubscriber;

  const subscriber = {
    email: email.trim(),
    firstname: firstname.trim(),
    lastname: lastname.trim(),
    subscriptions: Subscriber.defaultSubscriptions()
  };

  return { subscriber };
};
