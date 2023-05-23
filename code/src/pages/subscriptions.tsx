import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';

import { SubscriberBuilder } from 'classes/subscribers/SubscriberBuilder';
import Checkbox from 'components/Checkbox';
import { Modal } from 'components/Modal';
import Logger from 'constants/logger';
import Settings from 'constants/settings';
import Utils from 'constants/utils';
import Layout from 'fragments/Layout';
import SSR from 'private/ssr';
import ModalStyle from 'styles/Components/Modal.styles';
import { SubscribePrefStyle as SPS } from 'styles/Pages/Subscribe.styles';
import { ButtonVariant } from 'styles/Variables.styles';
import Contexts from 'utils/contexts';

// eslint-disable-next-line react/function-component-definition
const SubscriptionPreferences: NextPageWithLayout<SubscriptionsProps> = ({
  pageProps,
}) => {
  const { subscriber } = pageProps;

  const [state, setState] = useState<SubscriptionPreferencesState>({
    preferences: subscriber.subscriptions as SubscriptionsMapping,
    deleteModalVisible: false,
  });
  const dispatch = Utils.createDispatch(setState);
  const Alerts = useContext(Contexts.Alerts);
  const router = useRouter();

  async function updateSubscriptionPreferences() {
    try {
      const { id, firstname, lastname, email } = subscriber;
      const payload = {
        id,
        subscriber: new SubscriberBuilder()
          .withEmail(email)
          .withFirstName(firstname)
          .withLastName(lastname)
          .withSubscriptions(state.preferences)
          .build(),
      };

      await Utils.request('/api/subscribers', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      Alerts.success(
        "You've successfully updated your subscription preferences.",
      );
    } catch (e: any) {
      Alerts.report(e.message);
    }
  }

  async function unsubscribe() {
    try {
      await Utils.request('/api/subscribers', {
        method: 'DELETE',
        body: JSON.stringify({ id: subscriber.id }),
      });
      Alerts.set({
        type: 'success',
        message: "You've successfully unsubscribed from my blog.",
      });
      dispatch({ deleteModalVisible: false });
      void router.push('/');
    } catch (e: any) {
      reportError(e.message);
    }
  }

  function markPreference(e: React.ChangeEvent<HTMLInputElement>) {
    const { name } = e.target;
    dispatch({
      preferences: {
        ...state.preferences,
        [name]: !state.preferences[name],
      },
    });
  }

  return (
    <React.Fragment>
      <SPS.Container>
        <SPS.Main>
          <SPS.Heading>Subscription Preferences</SPS.Heading>
          <SPS.Email>{subscriber.email}</SPS.Email>
          <SPS.Text>You are subscribed to my:</SPS.Text>
          <SPS.PrefList>
            {Object.entries(state.preferences).map(([label, checked], key) => {
              return (
                <li key={key}>
                  <Checkbox
                    name={label}
                    label={label}
                    checked={checked}
                    onChange={markPreference}
                  />
                </li>
              );
            })}
          </SPS.PrefList>
          <SPS.Button onClick={updateSubscriptionPreferences}>
            Update Preferences
          </SPS.Button>
          <SPS.HyperlinkButton
            onClick={() => dispatch({ deleteModalVisible: true })}>
            Unsubscribe
          </SPS.HyperlinkButton>
        </SPS.Main>
      </SPS.Container>
      <Modal
        visible={state.deleteModalVisible}
        body={'Are you sure you want to unsubscribe?'}
        footer={
          <React.Fragment>
            <ModalStyle.FooterButton
              variant={ButtonVariant.CANCEL}
              onClick={unsubscribe}>
              Yes, I want to unsubscribe.
            </ModalStyle.FooterButton>
            <ModalStyle.FooterButton
              variant={ButtonVariant.CANCEL}
              onClick={() => dispatch({ deleteModalVisible: false })}>
              Cancel
            </ModalStyle.FooterButton>
          </React.Fragment>
        }
      />
    </React.Fragment>
  );
};

export const getServerSideProps: GetServerSideProps<
  SubscriptionsProps
> = async ({ query, res }) => {
  res.setHeader('X-Robots-Tag', 'noindex');

  try {
    const subscriber = JSON.parse(
      await SSR.Subscribers.getByToken(query.token as string),
    );

    return {
      props: {
        pathDefinition: {
          title: `Subscription Preferences | ${Settings.SITE_TITLE}`,
        },
        pageProps: {
          subscriber,
        },
      },
    };
  } catch (e) {
    Logger.error(e);
    return {
      notFound: true,
    };
  }
};

SubscriptionPreferences.getLayout = Layout.addPartials;
export default SubscriptionPreferences;

interface SubscriptionsProps extends AppPageProps {
  pageProps: {
    subscriber: SubscriberDAO;
  };
}

interface SubscriptionPreferencesState {
  preferences: SubscriptionsMapping;
  deleteModalVisible: boolean;
}
