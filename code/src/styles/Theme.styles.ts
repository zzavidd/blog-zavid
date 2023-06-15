import type { ThemeOptions } from '@mui/material';
import { createTheme } from '@mui/material';

import components from './Components.styles';
import { darkPalette } from './Palette.styles';
import typography from './Typography.styles';

export const themeOptions: ThemeOptions = {
  components,
  palette: darkPalette,
  shape: {
    borderRadius: 10,
  },
  spacing: [
    0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 640, 768, 896,
    1024, 1152, 1280,
  ],
  typography,
};

const theme = createTheme(themeOptions);
export default theme;
