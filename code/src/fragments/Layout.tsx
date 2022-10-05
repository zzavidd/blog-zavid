import React from 'react';

import { Body, BodyContent } from 'stylesv2/Global.styles';

import Footer from './shared/Footer';
import Header from './shared/Header';
import LeftNavigationBar from './shared/NavigationBar';

namespace Layout {
  export function addPartials(page: React.ReactElement) {
    return (
      <React.Fragment>
        <Header />
        <Body>
          <LeftNavigationBar />
          <BodyContent>{page}</BodyContent>
        </Body>
        <Footer />
      </React.Fragment>
    );
  }

  export function addHeaderOnly(page: React.ReactElement) {
    return (
      <React.Fragment>
        <Header />
        {page}
      </React.Fragment>
    );
  }
}

export default Layout;
