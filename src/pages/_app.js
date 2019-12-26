import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from '~/reducers/store.js';
import App from 'next/app';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

import Header from '~/partials/header.js';

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

  componentDidMount(){
    const {
      backgroundImage = 'bg-app.jpg'
    } = this.props.router.query;
  }


  render() {
    const { Component, pageProps } = this.props

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Header/>
          <Component {...pageProps} />
        </PersistGate>
      </Provider> 
    );
  }
}