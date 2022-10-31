import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';

import { SubscriberBuilder } from 'classes/subscribers/SubscriberBuilder';
import type { SubscriberDAO } from 'classes/subscribers/SubscriberDAO';
import Input from 'components/Input';
import Contexts from 'constants/contexts';
import { UIError } from 'constants/errors';
import HandlerFactory from 'constants/handlers';
import Settings from 'constants/settings';
import type { AppPageProps, NextPageWithLayout } from 'constants/types';
import Utils from 'constants/utils';
import Validate from 'constants/validations';
import Layout from 'fragments/Layout';
import FORM from 'styles/Components/Form.styles';
import SS from 'styles/Pages/Subscribe.styles';

// eslint-disable-next-line react/function-component-definition
const SubscribePage: NextPageWithLayout<AppPageProps> = () => {
  const [state, setState] = useState<SubscribePageState>({
    subscriber: {
      email: '',
      firstname: '',
      lastname: '',
    },
    isRequestPending: false,
  });
  const dispatch = Utils.createDispatch(setState);
  const Alerts = useContext(Contexts.Alerts);
  const router = useRouter();

  /** Create new subscriber on server. */
  async function submitSubscriber() {
    dispatch({ isRequestPending: true });

    try {
      Validate.subscriber(state.subscriber);

      const payload = new SubscriberBuilder()
        .withEmail(state.subscriber.email)
        .withFirstName(state.subscriber.firstname)
        .withLastName(state.subscriber.lastname)
        .withDefaultSubscriptions()
        .build();

      await Utils.request('/api/subscribers', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      Alerts.success(
        `Thank you for subscribing!\nI've added ${state.subscriber.email} to my mailing list.`,
      );
      setTimeout(() => {
        void router.push('/');
      }, 2000);
    } catch (e: any) {
      if (e instanceof UIError) {
        Alerts.report(e.message, true);
      } else if (e.message.includes('ER_DUP_ENTRY')) {
        Alerts.error('The email address you submitted already exists.');
      } else {
        reportError(e.message);
      }
    } finally {
      dispatch({ isRequestPending: false });
    }
  }

  const Handlers = HandlerFactory(setState, 'subscriber');

  return (
    <SS.Container>
      <FORM.Container>
        <SS.Heading>Subscribe to the ZAVID Blog</SS.Heading>
        <SS.Text>And never miss a diary entry nor a post.</SS.Text>
        <FORM.FieldRow>
          <FORM.Field>
            <FORM.Label>Email: *</FORM.Label>
            <Input.Email
              name={'email'}
              value={state.subscriber.email!}
              onChange={Handlers.text}
              placeholder={'Enter your email address'}
            />
          </FORM.Field>
        </FORM.FieldRow>
        <FORM.FieldRow>
          <FORM.Field flex={1}>
            <FORM.Label>First Name:</FORM.Label>
            <Input.Text
              name={'firstname'}
              value={state.subscriber.firstname!}
              onChange={Handlers.text}
              placeholder={'Enter your first name'}
            />
          </FORM.Field>
          <FORM.Field flex={1}>
            <FORM.Label>Last Name:</FORM.Label>
            <Input.Text
              name={'lastname'}
              value={state.subscriber.lastname!}
              onChange={Handlers.text}
              placeholder={'Enter your last name'}
            />
          </FORM.Field>
        </FORM.FieldRow>
        <FORM.FieldRow>
          <SS.Button onClick={submitSubscriber}>
            {state.isRequestPending ? 'Loading...' : 'Submit'}
          </SS.Button>
        </FORM.FieldRow>
      </FORM.Container>
    </SS.Container>
  );
};

export const getStaticProps: GetStaticProps<AppPageProps> = () => {
  return {
    props: {
      pathDefinition: {
        title: `Subscribe | ${Settings.SITE_TITLE}`,
        description:
          'Be the first to know when a new post or diary entry drops.',
        url: '/subscribe',
      },
    },
  };
};

SubscribePage.getLayout = Layout.addPartials;
export default SubscribePage;

interface SubscribePageState {
  subscriber: SubscriberDAO;
  isRequestPending: boolean;
}
