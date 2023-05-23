import type { PaletteOptions } from '@mui/material';
import { purple } from '@mui/material/colors';

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: purple['A100'],
  },
  background: {
    paper: 'rgb(17, 17, 17)',
  },
};

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: purple['A100'],
  },
  background: {
    paper: 'rgb(17, 17, 17)',
  },
};
