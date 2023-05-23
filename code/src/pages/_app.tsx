import { CssBaseline, Fade, ThemeProvider } from '@mui/material';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { SnackbarProvider } from 'notistack';
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from 'constants/reducers';
import AdminGateway from 'fragments/AdminGateway';
import MatomoScript from 'fragments/MatomoScript';
import PageMetadata from 'fragments/PageMetadata';
import CookiePrompt from 'fragments/shared/CookiePrompt';

// eslint-disable-next-line import/order
import 'react-datepicker/dist/react-datepicker.css';
import theme from 'stylesv2/Theme.styles';
import type { NavigationContextProps } from 'utils/contexts';
import { NavigationContext } from 'utils/contexts';
import { trpc } from 'utils/trpc';

const App = (props: AppProps) => {
  return (
    <React.Fragment>
      <PageMetadata {...props.pageProps.pathDefinition} />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SessionProvider session={props.pageProps.session}>
            <ZAVIDApp {...props} />
          </SessionProvider>
        </PersistGate>
      </Provider>
    </React.Fragment>
  );
};

export default trpc.withTRPC(App);

/**
 * The root of the ZAVID blog.
 * @param props The inherited props from the Next App.
 * @param props.Component The current component in view.
 * @param props.pageProps The properties for each page.
 * @returns The full page including the header and footer.
 */
function ZAVIDApp({ Component, pageProps }: AppPropsWithLayout) {
  const [state, setState] = useState({ isNavOpen: false });
  const context: NavigationContextProps = [
    state.isNavOpen,
    (isNavOpen) => setState({ isNavOpen }),
  ];

  // Configure layouts for all child components;
  const getLayout = Component.getLayout ?? ((page) => page);
  const ComponentWithLayout = getLayout(<Component {...pageProps} />);

  return (
    <AdminGateway onlyBlockInStaging={true}>
      <MatomoScript />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
          autoHideDuration={6000}
          maxSnack={2}
          TransitionComponent={Fade}>
          <NavigationContext.Provider value={context}>
            {ComponentWithLayout}
          </NavigationContext.Provider>
          <CookiePrompt />
        </SnackbarProvider>
      </ThemeProvider>
    </AdminGateway>
  );
}
