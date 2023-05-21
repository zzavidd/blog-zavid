import type { Components, Theme } from '@mui/material';
import { css } from '@mui/material';

import Settings from 'constants/settings';

const components: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: (theme) => {
      const bgImage = `${Settings.CLOUDINARY_BASE_URL}/static/bg/bg-app-${theme.palette.mode}`;
      return css`
        body {
          background-attachment: fixed;
          background-image: url(${bgImage});
          background-repeat: no-repeat;
          background-size: cover;
          font-feature-settings: 'lnum';
          height: 100vh;
          overscroll-behavior: none;
          transition: background-image 0.8s;
        }
      `;
    },
  },
};

export default components;
