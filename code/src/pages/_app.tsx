import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/scss/bootstrap.scss';
import App, { AppProps } from 'next/app';
import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import { Provider, useSelector, useDispatch, RootStateOrAny } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { alert, checkForSetAlerts } from 'src/components/alert.js';
import {
  CookiePrompt,
  setCookie,
  readCookie,
  clearCookie,
  checkCookiePolicyAccepted
} from 'src/lib/cookies';
import configureStore, { setTheme, setUser, clearUser } from 'src/lib/reducers.js';
import Footer from 'src/partials/footer.js';
import Header from 'src/partials/header.js';

import 'styles/App.scss';

library.add(fab, far, fas);

const { store, persistor } = configureStore();
const client = new ApolloClient({
  uri: '/api',
  cache: new InMemoryCache()
});

const AUTH_COOKIE = 'justAuthenticated';
const DEAUTH_COOKIE = 'justDeauthenticated';

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
const ZAVIDApp = ({ Component, pageProps }: AppProps) => {
  const [isLoaded, setLoaded] = useState(false);
  const [isCookiePolicyAccepted, setCookieAcceptance] = useState(
    checkCookiePolicyAccepted()
  );
  const dispatch = useDispatch();

  const theme = useSelector(({ theme }: RootStateOrAny) => {
    // TODO: Create theme enum
    if (theme !== 'light' && theme !== 'dark') {
      dispatch(setTheme('dark'));
      return 'dark';
    }
    return theme;
  });

  useEffect(() => {
    // Initialise Google Analytics
    ReactGA.initialize('UA-126408615-2');
    ReactGA.pageview(window.location.pathname + window.location.search);

    document.body.classList.add(`body-${theme}`);

    if (readCookie(AUTH_COOKIE)){
      dispatch(setUser({ isAuthenticated: true }));
      alert.success("You've successfully logged in.");
      clearCookie(AUTH_COOKIE);
    } else if (readCookie(DEAUTH_COOKIE)){
      dispatch(clearUser());
      alert.success("You've successfully logged out.");
      clearCookie(DEAUTH_COOKIE);
    }

    checkForSetAlerts();
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
