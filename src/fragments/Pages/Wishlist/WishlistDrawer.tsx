import type { SxProps, Theme } from '@mui/material';
import { Drawer, useMediaQuery, useTheme } from '@mui/material';
import immutate from 'immutability-helper';
import type React from 'react';
import { useContext } from 'react';

import { ShadowHeader } from 'fragments/Shared/Header';

import CategoryForm from './Forms/CategoryForm';
import FilterForm from './Forms/FilterForm';
import WishlistForm from './Forms/WishlistForm';
import { TrayFormContent, WishlistContext } from './WishlistContext';

const Forms: Record<TrayFormContent, React.ElementType> = {
  [TrayFormContent.WISHLIST_ITEM]: WishlistForm,
  [TrayFormContent.CATEGORIES]: CategoryForm,
  [TrayFormContent.FILTERS]: FilterForm,
};

export default function WishlistDrawer() {
  const [{ trayFormContent }, setContext] = useContext(WishlistContext);
  const Form = useForm();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  function onClose() {
    setContext((current) =>
      immutate(current, { trayFormContent: { $set: null } }),
    );
  }

  const DRAWER_WIDTH = theme.spacing(13);
  const drawerSx: SxProps<Theme> = {
    flexShrink: 1,
    transition: (t) =>
      t.transitions.create('width', {
        duration: t.transitions.duration.shortest,
      }),
    width: trayFormContent ? DRAWER_WIDTH : 0,
  };
  const paperSx: SxProps<Theme> = { boxSizing: 'border-box', width: '100%' };

  if (!isMobile) {
    drawerSx.flexShrink = 0;
    paperSx.borderLeft = `5px groove ${theme.palette.divider}`;
    paperSx.maxWidth = DRAWER_WIDTH;
  }

  return (
    <Drawer
      anchor={isMobile ? 'bottom' : 'right'}
      variant={'persistent'}
      onClose={onClose}
      open={Boolean(trayFormContent)}
      sx={drawerSx}
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
