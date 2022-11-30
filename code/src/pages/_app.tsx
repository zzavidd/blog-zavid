import { SessionProvider, useSession } from 'next-auth/react';
import type { AppProps } from 'next/app';
import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { StyleSheetManager, ThemeProvider } from 'styled-components';

import AlertBar from 'components/Alert';
import Snackbar from 'components/Snack';
import Contexts from 'constants/contexts';
import type { AppState } from 'constants/reducers';
import { AppActions, persistor, store } from 'constants/reducers';
import Utils from 'constants/utils';
import AdminGateway from 'fragments/AdminGateway';
import MatomoScript from 'fragments/MatomoScript';
import PageMetadata from 'fragments/PageMetadata';
import CookiePrompt from 'fragments/shared/CookiePrompt';
import { GlobalStyles } from 'styles/Global.styles';
import { THEME } from 'styles/Variables.styles';

const isDevelopmentMode = process.env.NEXT_PUBLIC_APP_ENV === 'development';

export default function App(props: AppProps) {
  return (
    <React.Fragment>
      <PageMetadata {...props.pageProps.pathDefinition} />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SessionProvider session={props.pageProps.session}>
            <StyleSheetManager disableVendorPrefixes={isDevelopmentMode}>
              <ZAVIDApp {...props} />
            </StyleSheetManager>
          </SessionProvider>
        </PersistGate>
      </Provider>
    </React.Fragment>
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
  const [state, setState] = useState<ZavidAppState>({
    alerts: [],
    snacks: [],
    isNavigationFocused: false,
  });
  const dispatch = Utils.createDispatch(setState);

  const appState = useSelector((state: AppState) => state);
  const appDispatch = useDispatch();
  const theme = THEME[appState.local.appTheme];

  const { data: session, status } = useSession();
  const email = session?.user?.email;

  /**
   * Sets the timeout for any displayed snacks unless the snack is defined to be
   * indefinite.
   */
  useEffect(() => {
    const index = state.snacks.findIndex(
      ({ duration }) => typeof duration === 'number',
    );
    if (index === -1) return;

    const duration = state.snacks[index].duration;
    if (typeof duration === 'number') {
      const timeout = setTimeout(() => {
        removeSnack(index);
      }, duration);

      return () => {
        clearTimeout(timeout);
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.snacks.length]);

  /**
   * Shows snack if user is logged in.
   */
  useEffect(() => {
    if (status !== 'authenticated' || appState.session.loginSnackShown) return;
    addSnack({ message: `Signed in as ${email}.` });
    appDispatch(AppActions.setLoginSnackShown(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, status]);

  /**
   * Adds an alert on the alert bar.
   * @param alert The alert definition.
   */
  function addAlert(alert: AlertDefinition) {
    dispatch({ alerts: [...state.alerts, alert] });
  }

  /**
   * Removes the alert at the specified index from the list of alerts.
   * @param index The alert to remove.
   */
  function removeAlert(index: number) {
    const alerts = [...state.alerts];
    alerts.splice(index, 1);
    dispatch({ alerts });
  }

  /**
   * Adds a snack to show on the snack bar.
   * @param snack The snack definition.
   */
  function addSnack(snack: SnackDefinition) {
    dispatch({ snacks: [...state.snacks, snack] });
  }

  /**
   * Removes the snack at the specified index from the list of snacks.
   * @param index The snack to remove.
   */
  function removeSnack(index: number) {
    const snacks = [...state.snacks];
    snacks.splice(index, 1);
    dispatch({ snacks });
  }

  // Configure layouts for all child components;
  const getLayout = Component.getLayout ?? ((page) => page);
  const ComponentWithLayout = getLayout(<Component {...pageProps} />);

  const providedContexts: ContextsProviderProps = {
    alerts: {
      alerts: state.alerts,
      set: addAlert,
      remove: removeAlert,
      success: (message) => addAlert({ type: 'success', message }),
      error: (message) => addAlert({ type: 'error', message }),
      report(message: string, shouldBeExplicit?: boolean): void {
        if (
          process.env.NEXT_PUBLIC_APP_ENV === 'production' &&
          !shouldBeExplicit
        ) {
          this.error('There was a problem. Please try again later.');
          console.error(message);
        } else {
          this.error(message);
        }
      },
    },
    snacks: {
      snacks: state.snacks,
      add: addSnack,
      remove: removeSnack,
    },
    navigation: [
      state.isNavigationFocused,
      (isOpen) => dispatch({ isNavigationFocused: isOpen }),
    ],
  };

  return (
    <AdminGateway onlyBlockInStaging={true}>
      <ContextsProvider {...providedContexts}>
        <MatomoScript />
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          {ComponentWithLayout}
          <CookiePrompt />
          <Snackbar />
          <AlertBar />
        </ThemeProvider>
      </ContextsProvider>
    </AdminGateway>
  );
}

function ContextsProvider({ children, ...props }: ContextsProviderProps) {
  return (
    <Contexts.Alerts.Provider value={props.alerts}>
      <Contexts.Navigation.Provider value={props.navigation}>
        <Contexts.Snacks.Provider value={props.snacks}>
          {children}
        </Contexts.Snacks.Provider>
      </Contexts.Navigation.Provider>
    </Contexts.Alerts.Provider>
  );
}

interface ZavidAppState {
  alerts: AlertDefinition[];
  snacks: SnackDefinition[];
  isNavigationFocused: boolean;
}

interface ContextsProviderProps extends React.PropsWithChildren {
  alerts: Contexts.AlertsProps;
  navigation: Contexts.NavigationProps;
  snacks: Contexts.SnacksProps;
}
