import { Button, ButtonGroup, CardActions } from '@mui/material';
import immutate from 'immutability-helper';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import { useContext } from 'react';

import { trpc } from 'utils/trpc';

import { WishlistContext } from '../WishlistContext';

import {
  WishlistItemContext,
  useWishlistItemState,
} from './WishlistItem.utils';

export default function ItemFooter() {
  const buttons = [LinkButton, ActionButton].filter((e) => e);

  return (
    <CardActions sx={{ justifySelf: 'flex-end', pt: 1, px: 4, pb: 4 }}>
      {buttons.length > 1 ? (
        <ButtonGroup fullWidth={true}>
          {buttons.map((ButtonEntry) => ButtonEntry())}
        </ButtonGroup>
      ) : (
        buttons[0]()
      )}
    </CardActions>
  );
}

function LinkButton() {
  const wishlistItem = useContext(WishlistItemContext);
  if (!wishlistItem.href) return null;
  return (
    <Button
      color={'primary'}
      href={wishlistItem.href}
      target={'_blank'}
      rel={'noopener'}
      key={'link'}>
      Visit link
    </Button>
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
      <Button
        color={'primary'}
        variant={'contained'}
        onClick={onUnclaim}
        key={'unclaim'}>
        Unclaim
      </Button>
    );
  }

  return (
    <Button
      color={'primary'}
      variant={'contained'}
      onClick={onClaim}
      key={'claim'}>
      Claim
    </Button>
  );
}
