import React from 'react';
import { Provider } from 'react-redux';
import App from 'next/app';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

import 'bootstrap/dist/css/bootstrap.min.css';

library.add(fab, far, fas);

export default class ZAVID extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
  }

  state = { isLoaded: false }


  render() {
    const { isLoaded } = this.state;
    const { Component, pageProps } = this.props;
    
    if (!isLoaded) return null;

    return (
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider> 
    );
  }
}