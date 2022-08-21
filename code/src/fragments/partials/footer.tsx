import React, { useState } from 'react';
import { Container } from 'react-bootstrap';

import { SubscriberBuilder } from 'classes';
import { alert, reportError } from 'components/alert';
import { ConfirmButton } from 'components/button';
import { Field, FieldRow, TextInput } from 'components/form';
import { Title, VanillaLink } from 'components/text';
import { accounts, copyright } from 'constants/settings';
import { UIError } from 'lib/errors';
import { Icon } from 'lib/library';
import { checkValidEmail } from 'lib/validations';
import css from 'styles/Partials.module.scss';

const footerLinks = [
  { name: 'About Zavid', url: '/about' },
  { name: 'Privacy Policy', url: '/privacy' },
  { name: 'Cookie Policy', url: '/cookies' },
];

export default function Footer() {
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
}

function FooterLinks() {
  return (
    <React.Fragment>
      <Title className={css['footer-links-title']}>INFORMATION</Title>
      {footerLinks.map(({ name, url }, key) => {
        return (
          <a key={key} href={url} className={css['footer-link']}>
            {name}
          </a>
        );
      })}
    </React.Fragment>
  );
}

function SocialPlugs() {
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
}

function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [isRequestPending, setRequestPending] = useState(false);

  async function subscribeEmail() {
    setRequestPending(true);
    try {
      checkValidEmail(email);

      const payload = new SubscriberBuilder()
        .withEmail(email)
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
        `Thank you for subscribing!\nI've added ${email} to my mailing list.`,
      );
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
}