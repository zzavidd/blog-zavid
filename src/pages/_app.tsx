import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import immutate from 'immutability-helper';
import type { AppProps as NextAppProps } from 'next/app';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import React, { useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import MatomoProvider from 'fragments/MatomoScript';
import PageMetadata from 'fragments/PageMetadata';
import SnackbarManager from 'fragments/SnackbarManager';
import { darkPalette, lightPalette } from 'styles/Palette.styles';
import { themeOptions } from 'styles/Theme.styles';
import { NavigationContext } from 'utils/contexts';
import { persistor, store, useAppSelector } from 'utils/reducers';
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
  const [isNavOpen, setNavOpen] = useState(false);
  const mode = useAppSelector((state) => state.theme);

  // Use theme for MUI.
  const theme = useMemo(() => {
    const palette = mode === 'light' ? lightPalette : darkPalette;
    const options = immutate(
      { ...themeOptions, palette },
      pageProps.theme
        ? {
            palette: (theme) => ({
              ...theme,
              primary: pageProps.theme?.[mode].primary,
              secondary: pageProps.theme?.[mode].secondary,
            }),
          }
        : {},
    );
    return createTheme(options);
  }, [mode, pageProps.theme]);

  // Configure layouts for all child components;
  const getLayout = Component.getLayout ?? ((page) => page);
  const ComponentWithLayout = getLayout(<Component {...pageProps} />);

  return (
    <MatomoProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarManager>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <NavigationContext.Provider value={[isNavOpen, setNavOpen]}>
              {ComponentWithLayout}
            </NavigationContext.Provider>
          </LocalizationProvider>
          {/* <CookiePrompt /> */}
        </SnackbarManager>
      </ThemeProvider>
    </MatomoProvider>
  );
}

type AppProps = NextAppProps<AppPageProps & { session: Session }>;
