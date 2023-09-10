import type { Components, Theme } from '@mui/material';
import { css } from '@mui/material';

import { darkPalette, lightPalette } from './Palette.styles';

const components: Components<Theme> = {
  MuiBackdrop: {
    defaultProps: {
      onContextMenu: (e) => e.preventDefault(),
    },
  },
  MuiBreadcrumbs: {
    styleOverrides: {
      root: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
      },
      ol: {
        justifyContent: 'center',
      },
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: ({ theme }) => css`
        min-width: ${theme.spacing(9)};
        padding-block: ${theme.spacing(3)};
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
    styleOverrides: (theme) => css`
      * {
        transition: ${theme.transitions.create(['background-color'], {
          duration: theme.transitions.duration.complex,
        })};
      }

      body {
        background-color: ${theme.palette.background.paper};
        font-feature-settings: 'lnum';
        overscroll-behavior: none;
        transition: ${theme.transitions.create(['background-color'], {
          duration: theme.transitions.duration.complex,
        })};
      }
    `,
  },
  MuiFormControlLabel: {
    styleOverrides: {
      root: {
        width: 'fit-content',
      },
      label: () => css`
        user-select: none;
        width: fit-content;
      `,
    },
  },
  MuiListItemText: {
    defaultProps: {
      sx: {
        pr: 5,
      },
    },
  },
  // [INFO]: Have to explicitly state for the sake of nested ThemeProviders.
  MuiLink: {
    styleOverrides: {
      root: ({ theme }) => ({
        color:
          theme.palette.mode === 'light'
            ? lightPalette.primary.main
            : darkPalette.primary.main,
      }),
    },
  },
  MuiMenu: {
    styleOverrides: {
      list: {
        padding: 0,
      },
    },
  },
  MuiMenuItem: {
    defaultProps: {
      sx: {
        py: 4,
      },
    },
  },
  MuiTypography: {
    defaultProps: {
      variantMapping: {
        h1: 'h1',
        h2: 'h1',
        h3: 'h2',
        h4: 'h3',
        text: 'p',
      },
    },
  },
};

export default components;
