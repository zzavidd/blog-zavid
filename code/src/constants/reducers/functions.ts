import type { PayloadAction } from '@reduxjs/toolkit';

import type { AppTheme } from 'classes/theme';

import type { AppLocalState, AppSessionState } from '.';

namespace Reducers {
  export namespace Local {
    export function saveInputText(
      state: AppLocalState,
      action: PayloadAction<string>,
    ) {
      state.savedText = action.payload;
    }

    export function setAppTheme(
      state: AppLocalState,
      action: PayloadAction<AppTheme>,
    ) {
      state.appTheme = action.payload;
    }

    export function setCookiePolicyAccepted(
      state: AppLocalState,
      action: PayloadAction<boolean>,
    ) {
      state.cookiePolicyAccepted = action.payload;
    }

    export function setWishlistSort<T extends keyof AppLocalState['wishlist']>(
      state: AppLocalState,
      action: PayloadAction<{ name: T; value: AppLocalState['wishlist'][T] }>,
    ) {
      const { name, value } = action.payload;
      state.wishlist[name] = value;
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
