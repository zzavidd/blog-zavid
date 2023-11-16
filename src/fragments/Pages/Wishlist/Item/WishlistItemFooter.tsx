import { Button, ButtonGroup } from '@mui/material';
import React, { useContext } from 'react';

import AdminMenuTrigger from './Triggers/AdminMenuTrigger';
import ClaimTrigger from './Triggers/ClaimTrigger';
import UnclaimTrigger from './Triggers/UnclaimTrigger';
import {
  WishlistItemContext,
  useWishlistItemState,
} from './WishlistItem.utils';

export default function WishlistItemFooterContent() {
  const buttons = [LinkButton, ActionButton, AdminMenuTrigger].filter((e) => e);

  return (
    <React.Fragment>
      {buttons.length > 1 ? (
        <ButtonGroup fullWidth={true}>
          {buttons.map((ButtonEntry) => ButtonEntry())}
        </ButtonGroup>
      ) : (
        buttons[0]()
      )}
    </React.Fragment>
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
      key={'link'}
      size={'small'}>
      Visit link
    </Button>
  );
}

function ActionButton() {
  const { isPurchased, isPrivate, allQuantityClaimed, isClaimedByUser } =
    useWishlistItemState();

  const allClaimedByOthers = allQuantityClaimed && !isClaimedByUser;
  const hideEitherClaimButton = isPurchased || isPrivate || allClaimedByOthers;

  if (hideEitherClaimButton) {
    return null;
  }

  if (isClaimedByUser) {
    return <UnclaimTrigger />;
  }

  return <ClaimTrigger />;
}
