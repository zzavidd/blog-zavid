import React from 'react';

import Footer from './shared/Footer';
import Header from './shared/Header';

namespace Layout {
  export function addPartials(page: React.ReactElement) {
    return (
      <React.Fragment>
        <Header />
        {page}
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
