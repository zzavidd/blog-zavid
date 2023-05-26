import type { PaletteMode } from '@mui/material';
import React from 'react';

import { AppTheme, FilterShapeOption, FilterThemeOption } from 'classes/theme';

export const InitialCuratorContextState: CuratorContextState = {
  contentTheme: AppTheme.DARK,
  filterTheme: FilterThemeOption.PURPLE,
  filterShape: FilterShapeOption.SQUARE,
  imageSource: '',
  isTitleOnly: false,
};

export const CuratorContext = React.createContext<CuratorContextProps>([
  InitialCuratorContextState,
  () => {},
]);

export interface CuratorContextState {
  contentTheme: PaletteMode;
  filterTheme: FilterThemeOption;
  filterShape: FilterShapeOption;
  imageSource: string;
  isTitleOnly: boolean;
}

type CuratorContextProps = ReactUseState<CuratorContextState>;
