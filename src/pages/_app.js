import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Container } from 'react-bootstrap';
import configureStore from '~/reducers/store.js';
import App from 'next/app';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

import Header from '~/partials/header.js';
import Sidebar from '~/partials/sidebar.js';

import { setTheme } from '~/reducers/actions.js';
import { theme as THEME } from '~/constants/settings.js';

import 'bootstrap/dist/css/bootstrap.min.css';

library.add(fab, far, fas);

const { store, persistor } = configureStore();

export default class ZAVID extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
  }

  componentDidMount() {
    THEME.initialise(store, setTheme);
  }

  render() {
    const { Component, pageProps, router } = this.props;
    const { sidebar = true } = router.query;

    const sideBarStyle = { display: 'grid', gridTemplateColumns: '70% 30%' };
    const style = sidebar ? sideBarStyle : null;

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Header />
          <Container style={style}>
            <Component {...pageProps} />
            {sidebar ? <Sidebar /> : null}
          </Container>
        </PersistGate>
      </Provider>
    );
  }
}
