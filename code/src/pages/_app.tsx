import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/scss/bootstrap.scss';
import Cookies from 'js-cookie';
import { SessionProvider } from 'next-auth/react';
import type { AppContext, AppProps } from 'next/app';
import App from 'next/app';
import React, { useEffect, useState } from 'react';
import * as ReactGA from 'react-ga';
import type { RootStateOrAny } from 'react-redux';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { Theme } from 'classes';
import { alert, checkForSetAlerts } from 'components/alert';
import Footer from 'fragments/partials/footer';
import Header from 'fragments/partials/header';
import { CookiePrompt } from 'lib/cookies';
import configureStore, { setTheme, setUser, clearUser } from 'lib/reducers';
import 'styles/App.scss';

library.add(fab, far, fas);

const { store, persistor } = configureStore();
const client = new ApolloClient({
  uri: '/api',
  cache: new InMemoryCache(),
});

const AUTH_COOKIE = 'justAuthenticated';
const DEAUTH_COOKIE = 'justDeauthenticated';

export default function (props: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloProvider client={client}>
          <SessionProvider session={props.pageProps.session}>
            <ZAVIDApp {...props} />
          </SessionProvider>
        </ApolloProvider>
      </PersistGate>
    </Provider>
  );
}

/**
 * The root of the ZAVID blog.
 * @param props The inherited props from the Next App.
 * @param props.Component The current component in view.
 * @param props.pageProps The properties for each page.
 * @returns The full page including the header and footer.
 */
function ZAVIDApp({ Component, pageProps }: AppProps) {
  const [isLoaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  const theme = useSelector(({ theme }: RootStateOrAny) => {
    if (Theme.isValid(theme)) {
      dispatch(setTheme(Theme.DARK));
      return Theme.DARK;
    }
    return theme;
  });

  useEffect(() => {
    // Initialise Google Analytics
    ReactGA.initialize('UA-126408615-2');
    ReactGA.pageview(window.location.pathname + window.location.search);

    document.body.classList.add(`body-${theme}`);

    if (Cookies.get(AUTH_COOKIE)) {
      dispatch(setUser({ isAuthenticated: true }));
      alert.success("You've successfully logged in.");
      Cookies.remove(AUTH_COOKIE);
    } else if (Cookies.get(DEAUTH_COOKIE)) {
      dispatch(clearUser());
      alert.success("You've successfully logged out.");
      Cookies.remove(DEAUTH_COOKIE);
    }

    checkForSetAlerts();
    setLoaded(true);
  }, [isLoaded]);

  return (
    <React.Fragment>
      <Header />
      <Component {...pageProps} />
      <Footer />
      <CookiePrompt />
    </React.Fragment>
  );
}

ZAVIDApp.getInitialProps = async (context: AppContext) => {
  const pageProps = await App.getInitialProps(context);
  return { ...pageProps };
};
