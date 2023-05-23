import type { PaletteMode } from '@mui/material';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { AppLocalState, AppSessionState } from '.';

namespace Reducers {
  export namespace Local {
    export function setAppTheme(
      state: AppLocalState,
      action: PayloadAction<PaletteMode>,
    ) {
      state.theme = action.payload;
    }

    export function setCookiePolicyAccepted(
      state: AppLocalState,
      action: PayloadAction<boolean>,
    ) {
      state.cookiePolicyAccepted = action.payload;
    }
  }

  export namespace Session {
    export function setLoginSnackShown(
      state: AppSessionState,
      action: PayloadAction<boolean>,
    ) {
      state.loginSnackShown = action.payload;
    }
  }
}

export default Reducers;
