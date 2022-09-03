import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/scss/bootstrap.scss';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import React, { useEffect } from 'react';
import type { RootStateOrAny } from 'react-redux';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { Theme } from 'classes';
import { checkForSetAlerts } from 'components/alert';
import configureStore, { setTheme } from 'constants/reducers';
import CookiePrompt from 'fragments/shared/CookiePrompt';
import Footer from 'fragments/shared/Footer';
import Header from 'fragments/shared/Header';
import 'styles/App.scss';

library.add(fab, far, fas);

const { store, persistor } = configureStore();

export default function App(props: AppProps) {
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
  const dispatch = useDispatch();

  const theme = useSelector(({ theme }: RootStateOrAny) => {
    if (Theme.isValid(theme)) {
      dispatch(setTheme(Theme.DARK));
      return Theme.DARK;
    }
    return theme;
  });

  useEffect(() => {
    document.body.classList.add(`body-${theme}`);
    checkForSetAlerts();
  }, []);

  return (
    <React.Fragment>
      <GoogleAnalyticsScripts />
      <Header />
      <Component {...pageProps} />
      <Footer />
      <CookiePrompt />
    </React.Fragment>
  );
}

function GoogleAnalyticsScripts() {
  if (process.env.NEXT_PUBLIC_APP_ENV !== 'production') return null;
  return (
    <React.Fragment>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
        strategy={'afterInteractive'}
      />
      <Script id={'google-analytics'} strategy={'afterInteractive'}>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}');
        `}
      </Script>
    </React.Fragment>
  );
}
