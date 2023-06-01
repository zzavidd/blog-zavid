import type { PaletteMode } from '@mui/material';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { StoreState } from '.';

export function setAppTheme(
  state: StoreState,
  action: PayloadAction<PaletteMode>,
): void {
  state.theme = action.payload;
}
