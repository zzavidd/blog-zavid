import type { PaletteOptions } from '@mui/material';
import { purple } from '@mui/material/colors';

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: purple['400'],
  },
  divider: 'rgba(0,0,0,0.3)',
  contrastThreshold: 4.5,
};

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: purple['A100'],
  },
  background: {
    paper: 'rgb(17, 17, 17)',
  },
  divider: 'rgba(255,255,255,0.3)',
  contrastThreshold: 4.5,
};
