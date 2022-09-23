import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/scss/bootstrap.scss';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import React, { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import Alert from 'constants/alert';
import type { AppState } from 'constants/reducers';
import { persistor, store } from 'constants/reducers';
import type { AppPropsWithLayout } from 'constants/types';
import CookiePrompt from 'fragments/shared/CookiePrompt';
import 'styles/App.scss';

library.add(fab, far, fas);

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
function ZAVIDApp({ Component, pageProps }: AppPropsWithLayout) {
  const { appTheme } = useSelector((state: AppState) => state);

  useEffect(() => {
    document.body.classList.add(`body-${appTheme}`);
    Alert.check();
  }, []);

  // Configure layouts for all child components;
  const getLayout = Component.getLayout ?? ((page) => page);
  const ComponentWithLayout = getLayout(<Component {...pageProps} />);

  return (
    <React.Fragment>
      <GoogleAnalyticsScripts />
      {ComponentWithLayout}
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

          gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}', {
            page_title: '${document.title}',
            page_url: '${location.pathname} + ${location.search}',
          });
        `}
      </Script>
    </React.Fragment>
  );
}
