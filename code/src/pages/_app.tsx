import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/scss/bootstrap.scss';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import React, { useEffect, useState } from 'react';
import * as ReactGA from 'react-ga';
import type { RootStateOrAny } from 'react-redux';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { Theme } from 'classes';
import { checkForSetAlerts } from 'components/alert';
import Footer from 'fragments/partials/Footer';
import Header from 'fragments/partials/Header';
import { CookiePrompt } from 'lib/cookies';
import configureStore, { setTheme } from 'lib/reducers';
import 'styles/App.scss';

library.add(fab, far, fas);

const { store, persistor } = configureStore();

const AUTH_COOKIE = 'justAuthenticated';
const DEAUTH_COOKIE = 'justDeauthenticated';

export default function (props: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SessionProvider session={props.pageProps.session}>
          <ZAVIDApp {...props} />
        </SessionProvider>
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

// ZAVIDApp.getInitialProps = async (context: AppContext) => {
//   const pageProps = await App.getInitialProps(context);
//   return { ...pageProps };
// };
