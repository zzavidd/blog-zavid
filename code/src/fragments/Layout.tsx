import React from 'react';

import { Body, BodyContent } from 'styles/Global.styles';

import Footer from './shared/Footer';
import Header from './shared/Header';
import { MainNavigationBar, MobileNavigationBar } from './shared/NavigationBar';

namespace Layout {
  export function addPartials(page: React.ReactElement) {
    return (
      <React.Fragment>
        <Header />
        <Body>
          <MainNavigationBar />
          <BodyContent>{page}</BodyContent>
        </Body>
        <Footer />
        <MobileNavigationBar />
      </React.Fragment>
    );
  }

  export function addHeaderOnly(page: React.ReactElement) {
    return (
      <React.Fragment>
        <Header />
        <Body>
          <MainNavigationBar />
          <BodyContent>{page}</BodyContent>
        </Body>
        <MobileNavigationBar />
      </React.Fragment>
    );
  }
}

export default Layout;
