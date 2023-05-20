import type { Components } from '@mui/material';
import { css } from '@mui/material';

const components: Components = {
  MuiCssBaseline: {
    styleOverrides: () => css`
      body {
        /* background-attachment: fixed;
        background-image: url();
        background-repeat: no-repeat;
        background-size: cover; */
        font-feature-settings: 'lnum';
        height: 100vh;
        overscroll-behavior: none;
        transition: background-image 0.8s;
      }
    `,
  },
};

export default components;
