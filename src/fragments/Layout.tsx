import { Stack } from '@mui/material';
import type React from 'react';

import Footer from './Shared/Footer';
import Header from './Shared/Header';
import { NavigationDrawer } from './Shared/NavigationDrawer';

namespace Layout {
  export function addPartials(page: React.ReactElement) {
    return (
      <Stack minHeight={'100vh'}>
        <Header />
        <NavigationDrawer />
        <Stack display={'grid'} flex={1}>
          {page}
        </Stack>
        <Footer />
      </Stack>
    );
  }
}

export default Layout;
