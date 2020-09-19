import { useMutation } from '@apollo/client';
import classnames from 'classnames';
import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

import { Subscriber } from 'classes';
import { alert, reportError } from 'components/alert';
import { ConfirmButton } from 'components/button';
import { FieldRow, Field, Label, TextInput } from 'components/form';
import { copyright } from 'constants/settings';
import { isValidEmail } from 'constants/validations';
import { CREATE_SUBSCRIBER_QUERY } from 'private/api/queries/subscriber.queries';
import css from 'styles/Partials.module.scss';

const footerLinks = [
  { name: 'About Zavid', url: '/about' },
  { name: 'Privacy Policy', url: '/privacy' },
  { name: 'Cookie Policy', url: '/cookies' }
];

export default () => {
  const classes = classnames(css['footer']);
  return (
    <footer className={classes}>
      <Container>
        <FieldRow>
          <Field lg={{ span: 4, order: 3 }}>
            <SubscribeForm />
          </Field>
          <Field lg={{ span: 4, order: 1 }}>
            {footerLinks.map(({ name, url }, key) => {
              return (
                <a key={key} href={url} className={css['footer-link']}>
                  {name}
                </a>
              );
            })}
          </Field>
          <Field lg={{ span: 4, order: 2 }}></Field>
        </FieldRow>
        <FieldRow>
          <Field>
            <div className={css['footer-copyright']}>{copyright}</div>
          </Field>
        </FieldRow>
      </Container>
    </footer>
  );
};

const SubscribeForm = () => {
  const [email, setEmail] = useState('');
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
  const subscribeEmail = () => {
    if (!isValidEmail(email)) return false;

    Promise.resolve()
      .then(() =>
        createSubscriberMutation({
          variables: {
            subscriber: {
              email,
              firstname: '',
              lastname: '',
              subscriptions: Subscriber.defaultSubscriptions()
            }
          }
        })
      )
      .then(() => {
        alert.success(
          `Thank you for subscribing!\nI've added ${email} to my mailing list.`
        );
      })
      .catch(({ message: error }) => {
        if (error.includes('ER_DUP_ENTRY')) {
          alert.error('The email address you submitted already exists.');
        } else {
          reportError(error);
        }
      });
  };

  return (
    <div>
      <Label>Quick Subscribe</Label>
      <div>And never miss a diary entry nor a post.</div>
      <TextInput
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={'Enter your email address'}
        className={css['quick-subscribe-input']}
      />
      <ConfirmButton
        onClick={subscribeEmail}
        isRequestPending={isRequestPending}
        className={css['quick-subscribe-button']}>
        Submit
      </ConfirmButton>
    </div>
  );
};
