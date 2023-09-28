import type { PaletteMode } from '@mui/material';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Spec } from 'immutability-helper';
import immutate from 'immutability-helper';

import type { AppState } from '.';

export function setAppTheme(
  state: AppState,
  action: PayloadAction<PaletteMode>,
): void {
  state.theme = action.payload;
}

export function setDiarySieve(
  state: AppState,
  action: PayloadAction<Spec<AppState['diary']>>,
): AppState {
  return immutate(state, { diary: action.payload });
}

export function setPostAdminSieve(
  state: AppState,
  action: PayloadAction<Spec<AppState['postAdmin']>>,
): AppState {
  return immutate(state, { postAdmin: action.payload });
}