import { Box, Stack } from '@mui/material';
import React from 'react';

import Footer from './shared/Footer';
import Header from './shared/Header';
import { NavigationDrawer } from './shared/NavigationDrawer';

namespace Layout {
  export function addPartials(page: React.ReactElement) {
    return (
      <Stack height={'100vh'}>
        <Header />
        <NavigationDrawer />
        <Box flex={1}>{page}</Box>
        <Footer />
      </Stack>
    );
  }
}

export default Layout;
