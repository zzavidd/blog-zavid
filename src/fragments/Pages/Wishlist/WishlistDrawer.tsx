import type { SxProps, Theme } from '@mui/material';
import { Drawer, useMediaQuery, useTheme } from '@mui/material';
import ImmutabilityHelper from 'immutability-helper';
import type React from 'react';
import { useContext } from 'react';

import { ShadowHeader } from 'fragments/Shared/Header';

import FilterForm from './Forms/FilterForm';
import WishlistForm from './Forms/WishlistForm';
import { TrayFormContent, WishlistContext } from './WishlistContext';

const Forms: Record<TrayFormContent, React.ElementType> = {
  [TrayFormContent.WISHLIST_ITEM]: WishlistForm,

  // [TrayFormContent.CATEGORIES]:CategoryForm,
  [TrayFormContent.FILTERS]: FilterForm,
};

export default function WishlistDrawer() {
  const [{ trayFormContent }, setContext] = useContext(WishlistContext);
  const Form = useForm();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  function onClose() {
    setContext((current) =>
      ImmutabilityHelper(current, { trayFormContent: { $set: null } }),
    );
  }

  const paperSx: SxProps<Theme> = { width: '100%' };

  if (!isMobile) {
    paperSx.borderLeft = `5px groove ${theme.palette.divider}`;
    paperSx.maxWidth = (t) => t.spacing(13);
  }

  return (
    <Drawer
      anchor={isMobile ? 'bottom' : 'right'}
      variant={'persistent'}
      onClose={onClose}
      open={Boolean(trayFormContent)}
      PaperProps={{
        elevation: 8,
        sx: paperSx,
      }}>
      <ShadowHeader />
      {Form ? <Form /> : null}
    </Drawer>
  );
}

function useForm(): React.ElementType | null {
  const [{ trayFormContent }] = useContext(WishlistContext);

  if (!trayFormContent) {
    return null;
  }

  return Forms[trayFormContent];
}
