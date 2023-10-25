import type { PaletteOptions } from '@mui/material';
import { grey, indigo, purple } from '@mui/material/colors';

export const lightPalette = {
  mode: 'light',
  primary: {
    main: purple['400'],
  },
  secondary: {
    main: indigo[700],
  },
  card: {
    default: grey['200'],
    claimed: '#d1d4e9',
    purchased: grey['400'],
  },
  divider: 'rgba(0,0,0,0.3)',
  contrastThreshold: 4.4,
} satisfies PaletteOptions;

export const darkPalette = {
  mode: 'dark',
  primary: {
    main: purple['A100'],
  },
  secondary: {
    main: indigo[100],
  },
  card: {
    default: grey['900'],
    claimed: '#171e2e',
    purchased: grey['700'],
  },
  background: {
    paper: 'rgb(17, 17, 17)',
  },
  divider: 'rgba(255,255,255,0.3)',
  contrastThreshold: 4.4,
} satisfies PaletteOptions;
