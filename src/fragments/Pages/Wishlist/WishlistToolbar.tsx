import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
  AppBar,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import immutate from 'immutability-helper';
import { useContext, useMemo } from 'react';

import { AdminLock } from 'fragments/AdminGateway';
import { useIsAdmin } from 'utils/hooks';
import { useAppSelector } from 'utils/reducers';
import { trpc } from 'utils/trpc';

import {
  InitialWishlistState,
  TrayFormContent,
  WishlistContext,
} from './WishlistContext';

export default function WishlistToolbar() {
  return (
    <AppBar
      elevation={2}
      position={'sticky'}
      sx={{ alignSelf: 'flex-end', top: 'auto', bottom: 0 }}>
      <Toolbar>
        <Container maxWidth={'xl'}>
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            width={'100%'}>
            <WishlistStatus />
            <Stack direction={'row'} columnGap={{ xs: 2, md: 3 }}>
              <AddItemButton />
              <FilterSortButton />
            </Stack>
          </Stack>
        </Container>
      </Toolbar>
    </AppBar>
  );
}

function WishlistStatus() {
  const params = useAppSelector((state) => state.wishlist.params);
  const { data: wishlist = [] } = trpc.wishlist.findMany.useQuery(params);

  const { cost, quantity } = useMemo(() => {
    const cost = wishlist
      .reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0)
      .toLocaleString('en-GB', {
        style: 'currency',
        currency: 'GBP',
      });
    const quantity = wishlist.length;
    return { cost, quantity };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wishlist.length]);

  return (
    <Stack>
      <Stack direction={'row'} columnGap={1}>
        <Typography fontSize={14} fontWeight={300}>
          Number of items:
        </Typography>
        <Typography fontSize={14} fontWeight={600}>
          {quantity}
        </Typography>
      </Stack>
      <Stack direction={'row'} columnGap={1}>
        <Typography fontSize={14} fontWeight={300}>
          Total:
        </Typography>
        <Typography fontSize={14} fontWeight={600}>
          {cost}
        </Typography>
      </Stack>
    </Stack>
  );
}

/**
 * The button for opening the filter / sort form.
 */
function FilterSortButton() {
  const [context, setContext] = useContext(WishlistContext);
  const isAdmin = useIsAdmin();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  /**
   * Opens the form tray with filters.
   */
  function toggleFilterView() {
    const content =
      context.trayFormContent === TrayFormContent.FILTERS
        ? null
        : TrayFormContent.FILTERS;
    setContext((current) =>
      immutate(current, {
        trayFormContent: {
          $set: content,
        },
      }),
    );
  }

  return (
    <Button
      onClick={toggleFilterView}
      startIcon={<FilterAltIcon />}
      variant={'outlined'}
      color={'primary'}
      sx={{ minWidth: 0, px: 3, py: 2 }}>
      {isAdmin && isMobile ? 'F/S' : 'Filter / Sort'}
    </Button>
  );
}

/**
 * The button for opening the wishlist form.
 */
function AddItemButton() {
  const [context, setContext] = useContext(WishlistContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isWishlistItemFormOpen =
    context.trayFormContent === TrayFormContent.WISHLIST_ITEM;

  /**
   * Opens the form tray with wishlist form when clicked.
   */
  function onAddButtonClick() {
    setContext((current) =>
      immutate(current, {
        trayFormContent: { $set: TrayFormContent.WISHLIST_ITEM },
        selectedWishlistItem: { $set: null },
        wishlistItemRequest: { $set: InitialWishlistState.wishlistItemRequest },
      }),
    );
  }

  return (
    <AdminLock>
      <Button
        onClick={onAddButtonClick}
        color={'primary'}
        variant={'contained'}
        startIcon={<AddIcon />}
        disabled={isWishlistItemFormOpen}
        sx={{ minWidth: 0, px: 3, py: 2 }}>
        {isMobile ? 'Add' : 'Add Item'}
      </Button>
    </AdminLock>
  );
}
