import React from 'react';

import Footer from './shared/Footer';
import Header from './shared/Header';
import { NavigationDrawer } from './shared/NavigationDrawer';

namespace Layout {
  export function addPartials(page: React.ReactElement) {
    return (
      <React.Fragment>
        <Header />
        <NavigationDrawer />
        {page}
        <Footer />
      </React.Fragment>
    );
  }

  export function addHeaderOnly(page: React.ReactElement) {
    return (
      <React.Fragment>
        <NavigationDrawer />
        {page}
      </React.Fragment>
    );
  }
}

export default Layout;
