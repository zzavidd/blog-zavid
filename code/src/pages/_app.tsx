import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { StyleSheetManager, ThemeProvider } from 'styled-components';

import AlertBar from 'componentsv2/Alert';
import Snackbar from 'componentsv2/Snack';
import Contexts from 'constants/contexts';
import type { AppState } from 'constants/reducers';
import { persistor, store } from 'constants/reducers';
import type {
  AlertDefinition,
  AppPropsWithLayout,
  SnackDefinition,
} from 'constants/types';
import Utils from 'constants/utils';
import AdminGateway from 'fragments/AdminGateway';
import GoogleAnalyticsScripts from 'fragments/GoogleAnalyticsTag';
import CookiePrompt from 'fragments/shared/CookiePrompt';
import 'styles/App.scss';
import { GlobalStyles } from 'stylesv2/Global.styles';
import { THEME } from 'stylesv2/Variables.styles';

library.add(fab, far, fas);

export default function App(props: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SessionProvider session={props.pageProps.session}>
          <StyleSheetManager
            disableVendorPrefixes={
              process.env.NEXT_PUBLIC_APP_ENV === 'development'
            }>
            <ZAVIDApp {...props} />
          </StyleSheetManager>
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
  const [state, setState] = useState<ZavidAppState>({
    alerts: [],
    snacks: [],
    isNavigationFocused: false,
  });
  const dispatch = Utils.createDispatch(setState);

  const themeName = useSelector((state: AppState) => state.appTheme);
  const theme = THEME[themeName];

  /**
   * Sets the timeout for any displayed alerts.
   */
  useEffect(() => {
    if (!state.alerts.length) return;

    // const timeout = setTimeout(() => {
    //   removeAlert(state.alerts.length - 1);
    // }, 4500);

    // return () => {
    //   clearTimeout(timeout);
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.alerts.length]);

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
        <GoogleAnalyticsScripts />
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          {ComponentWithLayout}
          <Snackbar />
          <CookiePrompt />
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
