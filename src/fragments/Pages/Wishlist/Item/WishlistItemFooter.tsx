import { Button, ButtonGroup, CardActions } from '@mui/material';
import immutate from 'immutability-helper';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import { useContext } from 'react';

import { trpc } from 'utils/trpc';

import { TrayFormContent, WishlistContext } from '../WishlistContext';

import {
  WishlistItemContext,
  useWishlistItemState,
} from './WishlistItem.utils';

export default function ItemFooter() {
  const [, setContext] = useContext(WishlistContext);
  const wishlistItem = useContext(WishlistItemContext);

  /**
   * Opens the link in a new tab for the focused wishlist item.
   */
  function onVisitLink() {
    window.open(wishlistItem.href, '_blank', 'noopener,noreferrer');
  }

  /**
   * Opens the form and populates fields with the information of the item clicked.
   */
  function onEdit() {
    setContext((current) =>
      immutate(current, {
        trayFormContent: { $set: TrayFormContent.WISHLIST_ITEM },
        selectedWishlistItem: { $set: wishlistItem },
        wishlistItemRequest: {
          $set: {
            ...wishlistItem,
            price: wishlistItem.price.toFixed(2) as unknown as number,
            reservees: wishlistItem.reservees as WishlistReservees,
          },
        },
      }),
    );
  }

  /**
   * Prompts to delete the focused wishlist item.
   */
  function onDelete() {
    setContext((current) =>
      immutate(current, {
        isDeletePromptVisible: { $set: true },
        selectedWishlistItem: { $set: wishlistItem },
      }),
    );
  }

  return (
    <CardActions sx={{ justifySelf: 'flex-end', pt: 1, px: 4, pb: 4 }}>
      <ButtonGroup fullWidth={true}>
        {wishlistItem.href ? (
          <Button color={'secondary'} onClick={onVisitLink}>
            Visit link
          </Button>
        ) : null}
        <ActionButton />
      </ButtonGroup>
      {/* <AdminLock>
        <Stack direction={'row'}>
          <Button onClick={onEdit} startIcon={<EditIcon />}>
            Edit
          </Button>
          <Button onClick={onDelete} color={'error'} startIcon={<DeleteIcon />}>
            Delete
          </Button>
        </Stack>
      </AdminLock> */}
    </CardActions>
  );
}

function ActionButton() {
  const wishlistItem = useContext(WishlistItemContext);
  const [, setContext] = useContext(WishlistContext);
  const { enqueueSnackbar } = useSnackbar();

  const session = useSession();
  const { isPurchased, isPrivate, allQuantityClaimed, isClaimedByUser } =
    useWishlistItemState();

  const { mutate: unclaimWishlistItem } = trpc.wishlist.unclaim.useMutation({
    onSuccess: () => {
      enqueueSnackbar(
        `You have removed your claim on "${wishlistItem.name}".`,
        { variant: 'success' },
      );
    },
    onError: (e) => {
      enqueueSnackbar(e.message, { variant: 'error' });
    },
  });

  /**
   * Claims an item by assigning a reservee to it.
   */
  function onClaim() {
    setContext((c) =>
      immutate(c, {
        isClaimPromptVisible: { $set: true },
        selectedWishlistItem: { $set: wishlistItem },
      }),
    );
  }

  function onUnclaim() {
    const email = session.data?.user?.email;
    if (email) {
      unclaimWishlistItem({ id: wishlistItem.id, email });
    } else {
      enqueueSnackbar('You are not signed in.', { variant: 'error' });
    }
  }

  const allClaimedByOthers = allQuantityClaimed && !isClaimedByUser;
  const hideEitherClaimButton = isPurchased || isPrivate || allClaimedByOthers;

  if (hideEitherClaimButton) {
    return null;
  }

  if (isClaimedByUser) {
    return (
      <Button color={'secondary'} variant={'contained'} onClick={onUnclaim}>
        Unclaim
      </Button>
    );
  }

  return (
    <Button color={'secondary'} variant={'contained'} onClick={onClaim}>
      Claim
    </Button>
  );
}
