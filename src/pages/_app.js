import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/scss/bootstrap.scss';
import App from 'next/app';
import React, { useEffect, useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import Header from 'partials/header.js';
import Sidebar from 'partials/sidebar.js';
import configureStore from 'reducers/store.js';

import 'styles/App.scss';

library.add(fab, far, fas);

const { store, persistor } = configureStore();
const client = new ApolloClient({
  // link: onError(({ graphQLErrors = [], networkError }) => {
  //   if (graphQLErrors)
  //     graphQLErrors.forEach(({ message, locations, path }) =>
  //       console.error(
  //         `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
  //       )
  //     );
  //   if (networkError) console.error(`[Network error]: ${networkError}`);
  // }),
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
 * @param {object} props.router - The server-side router object.
 * @returns {React.Component} - The full page including the header and footer.
 */
const ZAVIDApp = ({ Component, pageProps, router }) => {
  const [isLoaded, setLoaded] = useState(false);

  const theme = useSelector(({ theme }) => theme || 'light');
  const { hideSidebar = false } = router.query;

  useEffect(() => {
    document.body.classList.add(`body-${theme}`);
    setLoaded(true);
  }, [isLoaded]);

  return (
    <>
      <Header />
      <div className={hideSidebar ? 'app' : 'app-with-sidebar'}>
        <Component {...pageProps} />
        <AppSidebar hideSidebar={hideSidebar} />
      </div>
    </>
  );
};

const AppSidebar = ({ hideSidebar }) => {
  if (hideSidebar) return null;
  return <Sidebar />;
};

ZAVID.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  return { pageProps };
};
