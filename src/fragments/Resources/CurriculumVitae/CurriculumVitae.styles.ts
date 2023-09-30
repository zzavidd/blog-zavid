import { css } from '@emotion/react';
import { createTheme, darken } from '@mui/material';
import { blue, deepPurple } from '@mui/material/colors';
import immutate from 'immutability-helper';
import { Montserrat } from 'next/font/google';

import { themeOptions } from 'styles/Theme.styles';

export const montserrat = Montserrat({
  display: 'swap',
  preload: true,
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
});

const options = immutate(themeOptions, {
  components: {
    $set: {
      MuiList: {
        defaultProps: {
          disablePadding: true,
        },
      },
      MuiListItem: {
        defaultProps: {
          disablePadding: true,
          disableGutters: true,
        },
      },
    },
  },
  palette: {
    $set: {
      primary: {
        main: darken(deepPurple[700], 0.8),
      },
      secondary: {
        main: blue[900],
      },
    },
  },
  typography: {
    $set: {
      fontFamily: montserrat.style.fontFamily,
      h1: {
        fontSize: 20,
      },
      h2: {
        fontSize: 16,
        fontWeight: 600,
        textTransform: 'uppercase',
        marginBottom: '0.6rem',
      },
      h3: {
        letterSpacing: -0.75,
        fontSize: 16,
        fontWeight: 700,
      },
      h4: {
        fontSize: 14,
        fontWeight: 600,
        textTransform: 'uppercase',
        marginBottom: '0.4rem',
      },
      subtitle1: {
        fontSize: 11.5,
        lineHeight: 1.65,
        fontWeight: 600,
      },
      body1: {
        fontSize: 14,
        lineHeight: 1.65,
      },
      body2: {
        fontSize: 11,
        fontWeight: 500,
        lineHeight: 1.6,
      },
      caption: {
        fontSize: 11,
        fontStyle: 'italic',
        fontWeight: 700,
      },
    },
  },
});

const cvLightThemeOptions = immutate(options, {
  components: {
    MuiTypography: {
      $set: {
        defaultProps: {
          color: 'black',
        },
      },
    },
  },
  palette: {
    mode: { $set: 'light' },
    text: { $set: { primary: 'black' } },
    divider: { $set: 'rgba(0,0,0,0.8)' },
  },
});

const cvDarkThemeOptions = immutate(options, {
  components: {
    MuiCssBaseline: {
      $set: {
        styleOverrides: () => css`
          svg {
            path {
              fill: white;
            }
          }
        `,
      },
    },
  },
  palette: {
    mode: { $set: 'dark' },
    text: { $set: { primary: 'white' } },
    divider: { $set: 'rgba(255,255,255,0.6)' },
  },
});

export const CVLightTheme = createTheme(cvLightThemeOptions);
export const CVDarkTheme = createTheme(cvDarkThemeOptions);
