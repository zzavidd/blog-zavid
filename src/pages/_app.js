import React, { useState, useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Container } from 'react-bootstrap';
import configureStore from '~/reducers/store.js';
import App from 'next/app';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

import Header from 'partials/header.js';
import Sidebar from 'partials/sidebar.js';

import { setTheme, toggleTheme } from 'reducers/actions.js';

import 'bootstrap/dist/css/bootstrap.min.css';

library.add(fab, far, fas);

const { store, persistor } = configureStore();

export default class ZAVID extends App {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ZAVIDApp {...this.props} />
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
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(toggleTheme());
  }, [isLoaded]);

  const { sidebar = true } = router.query;

  const style = sidebar
    ? { display: 'grid', gridTemplateColumns: '70% 30%' }
    : null;

  return (
    <>
      <Header />
      <Container style={style}>
        <Component {...pageProps} />
        {sidebar ? <Sidebar /> : null}
      </Container>
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
