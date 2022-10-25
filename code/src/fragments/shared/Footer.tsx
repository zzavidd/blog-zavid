import type { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import {
  faInstagram,
  faLinkedin,
  faSnapchat,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useState } from 'react';

import { SubscriberBuilder } from 'classes/subscribers/SubscriberBuilder';
import Input from 'components/Input';
import Contexts from 'constants/contexts';
import { UIError } from 'constants/errors';
import Settings from 'constants/settings';
import Utils from 'constants/utils';
import Validate from 'constants/validations';
import FooterStyle from 'styles/Partials/Footer.styles';

const FOOTER_LINKS = [
  { name: 'About Zavid', url: '/about' },
  { name: 'Privacy Policy', url: '/privacy' },
  { name: 'Cookie Policy', url: '/cookies' },
];

const SOCIAL_PLUGS: {
  name: keyof typeof Settings.ACCOUNTS;
  icon: IconDefinition;
}[] = [
  { name: 'twitter', icon: faTwitter },
  { name: 'instagram', icon: faInstagram },
  { name: 'linkedin', icon: faLinkedin },
  { name: 'snapchat', icon: faSnapchat },
];

export default function Footer() {
  return (
    <FooterStyle.Container>
      <FooterStyle.Content>
        <FooterStyle.Row>
          <SocialPlugs />
          <SubscribeForm />
          <FooterLinks />
        </FooterStyle.Row>
        <FooterStyle.CopyrightBox>
          <FooterStyle.Copyright>{Settings.COPYRIGHT}</FooterStyle.Copyright>
        </FooterStyle.CopyrightBox>
      </FooterStyle.Content>
    </FooterStyle.Container>
  );
}

function FooterLinks() {
  return (
    <FooterStyle.LinksMenuBox>
      <FooterStyle.Heading>INFORMATION</FooterStyle.Heading>
      <FooterStyle.LinksMenu>
        {FOOTER_LINKS.map(({ name, url }, key) => {
          return (
            <li key={key}>
              <a href={url}>{name}</a>
            </li>
          );
        })}
      </FooterStyle.LinksMenu>
    </FooterStyle.LinksMenuBox>
  );
}

function SocialPlugs() {
  return (
    <FooterStyle.SocialPlugsBox>
      <FooterStyle.Heading>Follow me on socials</FooterStyle.Heading>
      <FooterStyle.SocialIcons>
        {SOCIAL_PLUGS.map(({ name, icon }) => {
          return (
            <a href={Settings.ACCOUNTS[name]} key={name}>
              <FontAwesomeIcon icon={icon} />
            </a>
          );
        })}
      </FooterStyle.SocialIcons>
    </FooterStyle.SocialPlugsBox>
  );
}

function SubscribeForm() {
  const [state, setState] = useState({
    email: '',
    isRequestPending: false,
    honeypotInput: '',
  });
  const dispatch = Utils.createDispatch(setState);

  const Alerts = useContext(Contexts.Alerts);

  async function subscribeEmail() {
    dispatch({ isRequestPending: true });

    if (state.honeypotInput) {
      return Alerts.set({
        type: 'success',
        message: `Thank you for subscribing!\nI've added ${state.email} to my mailing list.`,
      });
    }

    try {
      Validate.email(state.email);

      const payload = new SubscriberBuilder()
        .withEmail(state.email)
        .withDefaultSubscriptions()
        .build();

      await Utils.request('/api/subscribers', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      Alerts.success(
        `Thank you for subscribing!\nI've added ${state.email} to my mailing list.`,
      );
    } catch (e: any) {
      if (e instanceof UIError) {
        Alerts.report(e.message, true);
      } else if (e.message.includes('ER_DUP_ENTRY')) {
        Alerts.error('The email address you submitted already exists.');
      } else {
        Alerts.report(e.message);
      }
    } finally {
      dispatch({ isRequestPending: false });
    }
  }

  return (
    <FooterStyle.SubscribeFormBox>
      <FooterStyle.Heading>Quick Subscribe</FooterStyle.Heading>
      <FooterStyle.Summary>
        And never miss a diary entry nor a post.
      </FooterStyle.Summary>
      <Input.Email
        value={state.email}
        onChange={(e) => dispatch({ email: e.target.value })}
        placeholder={'Enter your email address'}
      />
      <FooterStyle.SubscribeButton onClick={subscribeEmail}>
        {state.isRequestPending ? 'Subscribing...' : 'Subscribe'}
      </FooterStyle.SubscribeButton>
      <FooterStyle.HoneyPot
        value={state.honeypotInput}
        onChange={(e) => dispatch({ honeypotInput: e.target.value })}
        tabIndex={-1}
        autoComplete={'off'}
      />
    </FooterStyle.SubscribeFormBox>
  );
}
