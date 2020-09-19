import { useMutation } from '@apollo/client';
import classnames from 'classnames';
import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

import { Subscriber } from 'classes';
import { alert, reportError } from 'components/alert';
import { ConfirmButton } from 'components/button';
import { FieldRow, Field, Label, TextInput } from 'components/form';
import { Icon } from 'components/icon';
import { Title, VanillaLink } from 'components/text';
import { copyright, accounts } from 'constants/settings';
import { isValidEmail } from 'constants/validations';
import { CREATE_SUBSCRIBER_QUERY } from 'private/api/queries/subscriber.queries';
import css from 'styles/Partials.module.scss';

const footerLinks = [
  { name: 'About Zavid', url: '/about' },
  { name: 'Privacy Policy', url: '/privacy' },
  { name: 'Cookie Policy', url: '/cookies' }
];

export default () => {
  return (
    <footer className={css['footer']}>
      <Container className={css['footer-container']}>
        <FieldRow>
          <Field lg={{ span: 5, order: 2 }} className={css['footer-field']}>
            <SocialPlugs />
          </Field>
          <Field lg={{ span: 4, order: 3 }} className={css['footer-field']}>
            <SubscribeForm />
          </Field>
          <Field lg={{ span: 3, order: 1 }} className={css['footer-field']}>
            <FooterLinks />
          </Field>
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

const FooterLinks = () => {
  return (
    <>
      <Title className={css['footer-links-title']}>INFORMATION</Title>
      {footerLinks.map(({ name, url }, key) => {
        return (
          <a key={key} href={url} className={css['footer-link']}>
            {name}
          </a>
        );
      })}
    </>
  );
};

const SocialPlugs = () => {
  return (
    <div>
      <Title className={css['footer-socials-title']}>
        Follow me on socials
      </Title>
      <div>
        <VanillaLink href={accounts.twitter} className={css['footer-socials']}>
          <Icon name={'twitter'} prefix={'fab'} withRightSpace={false} />
        </VanillaLink>
        <VanillaLink
          href={accounts.instagram}
          className={css['footer-socials']}>
          <Icon name={'instagram'} prefix={'fab'} withRightSpace={false} />
        </VanillaLink>
        <VanillaLink href={accounts.linkedin} className={css['footer-socials']}>
          <Icon name={'linkedin'} prefix={'fab'} withRightSpace={false} />
        </VanillaLink>
        <VanillaLink href={accounts.snapchat} className={css['footer-socials']}>
          <Icon name={'snapchat-ghost'} prefix={'fab'} withRightSpace={false} />
        </VanillaLink>
      </div>
    </div>
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
      <Title className={css['quick-subscribe-title']}>Quick Subscribe</Title>
      <div className={css['quick-subscribe-message']}>
        And never miss a diary entry nor a post.
      </div>
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
