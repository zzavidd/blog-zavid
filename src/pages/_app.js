import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/scss/bootstrap.scss';
import App from 'next/app';
import React, { useEffect, useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { checkAlert } from 'components/alert.js';
import {
  CookiePrompt,
  setCookie,
  checkCookiePolicyAccepted
} from 'lib/cookies';
import configureStore from 'lib/reducers.js';
import Footer from 'partials/footer.js';
import Header from 'partials/header.js';

import 'styles/App.scss';

library.add(fab, far, fas);

const { store, persistor } = configureStore();
const client = new ApolloClient({
  uri: '/api',
  cache: new InMemoryCache()
});

export default class ZAVID extends App {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ApolloProvider client={client}>
            <ZAVIDApp {...this.props} />
          </ApolloProvider>
        </PersistGate>
      </Provider>
    );
  }
}

/**
 * The root of the ZAVID blog.
 * @param {object} props - The inherited props from the Next App.
 * @param {object} props.Component - The current component in view.
 * @param {object} props.pageProps - The properties for each page.
 * @returns {React.Component} - The full page including the header and footer.
 */
const ZAVIDApp = ({ Component, pageProps }) => {
  const [isLoaded, setLoaded] = useState(false);
  const [isCookiePolicyAccepted, setCookieAcceptance] = useState(
    checkCookiePolicyAccepted
  );

  const theme = useSelector(({ theme }) => theme || 'light');

  useEffect(() => {
    document.body.classList.add(`body-${theme}`);
    checkAlert();
    setLoaded(true);
  }, [isLoaded]);

  /**
   * Show the cookies prompt if the cookie policy has not been accepted.
   * @returns {React.Component}The cookie prompt component. Null if cookies have been accepted.
   */
  const CookiePolicyAlert = () => {
    if (isCookiePolicyAccepted) return null;
    return (
      <CookiePrompt
        acceptCookies={() => {
          setCookie('cookiesAccepted', true, 365 * 24);
          setCookieAcceptance(true);
        }}
      />
    );
  };

  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
      <CookiePolicyAlert />
    </>
  );
};

ZAVID.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  return { pageProps };
};
