import { Stack } from '@mui/material';
import React from 'react';

import Footer from './shared/Footer';
import Header from './shared/Header';
import { NavigationDrawer } from './shared/NavigationDrawer';

namespace Layout {
  export function addPartials(page: React.ReactElement) {
    return (
      <Stack minHeight={'100vh'}>
        <Header />
        <NavigationDrawer />
        <Stack flex={1}>{page}</Stack>
        <Footer />
      </Stack>
    );
  }
}

export default Layout;
