import type { Components, Theme } from '@mui/material';
import { css } from '@mui/material';

const components: Components<Theme> = {
  MuiAppBar: {
    defaultProps: {
      color: 'default',
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: ({ ownerState, theme }) => {
        const color = theme.palette[ownerState.severity!][theme.palette.mode];
        return {
          border: `1.5px solid ${color}`,
        };
      },
    },
  },
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

      *::-webkit-scrollbar {
        width: 0.6em;
      }

      *::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
        background-color: ${theme.palette.grey['900']};
      }

      *::-webkit-scrollbar-thumb {
        background-color: ${theme.palette.grey['800']};
        border-radius: ${theme.shape.borderRadius}px;
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
        color: theme.palette.primary.main,
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
