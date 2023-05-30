import type { Components, Theme } from '@mui/material';
import { css } from '@mui/material';

import Settings from 'utils/settings';

const components: Components<Theme> = {
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: ({ theme }) => css`
        min-height: ${theme.spacing(7)};
      `,
    },
  },
  MuiCheckbox: {
    styleOverrides: {
      root: ({ theme }) => css`
        padding: ${theme.spacing(1)};
      `,
    },
  },
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
          overscroll-behavior: none;
          transition: background-image 0.8s;
        }
      `;
    },
  },
  MuiFormControlLabel: {
    styleOverrides: {
      label: () => css`
        user-select: none;
        width: fit-content;
      `,
    },
  },
  MuiMenu: {
    styleOverrides: {
      list: {
        padding: 0,
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(3),
      }),
      input: ({ theme }) => ({
        padding: theme.spacing(2),
      }),
    },
  },
};

export default components;
