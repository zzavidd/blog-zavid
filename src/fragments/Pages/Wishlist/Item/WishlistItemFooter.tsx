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
  // const [, setContext] = useContext(WishlistContext);
  const wishlistItem = useContext(WishlistItemContext);

  /**
   * Opens the link in a new tab for the focused wishlist item.
   */
  function onVisitLink() {
    window.open(wishlistItem.href, '_blank', 'noopener,noreferrer');
  }

  /**
   * Prompts to delete the focused wishlist item.
   */
  // function onDelete() {
  //   setContext((current) =>
  //     immutate(current, {
  //       isDeletePromptVisible: { $set: true },
  //       selectedWishlistItem: { $set: wishlistItem },
  //     }),
  //   );
  // }

  return (
    <CardActions sx={{ justifySelf: 'flex-end', pt: 1, px: 4, pb: 4 }}>
      <ButtonGroup fullWidth={true}>
        {wishlistItem.href ? (
          <Button color={'primary'} onClick={onVisitLink}>
            Visit link
          </Button>
        ) : null}
        <ActionButton />
      </ButtonGroup>
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
      <Button color={'primary'} variant={'contained'} onClick={onUnclaim}>
        Unclaim
      </Button>
    );
  }

  return (
    <Button color={'primary'} variant={'contained'} onClick={onClaim}>
      Claim
    </Button>
  );
}
