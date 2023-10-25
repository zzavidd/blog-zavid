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
        {page}
        <Footer />
      </Stack>
    );
  }
}

export default Layout;

export function Root({ children }: React.PropsWithChildren) {
  return (
    <Stack display={'grid'} flex={1}>
      {children}
    </Stack>
  );
}
