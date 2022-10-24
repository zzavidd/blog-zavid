import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { signIn, useSession } from 'next-auth/react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import useSWR, { mutate } from 'swr';

import type WishlistDAO from 'classes/wishlist/WishlistDAO';
import Clickable from 'componentsv2/Clickable';
import Contexts from 'constants/contexts';
import type { AppState } from 'constants/reducers';
import Utils from 'constants/utils';
import AdminLock from 'fragments/AdminLock';
import type { UnclaimWishlistItemPayload } from 'private/api/wishlist';
import WL from 'stylesv2/Pages/Wishlist.styles';
import { THEME } from 'stylesv2/Variables.styles';

import { WishlistPageContext } from './WishlistContext';
import WishlistToolbar from './WishlistToolbar';

const SORT_BY: Record<
  keyof WishlistDAO,
  (a: WishlistDAO, b: WishlistDAO) => number
> = {
  name: (a, b) =>
    a.name.localeCompare(b.name, 'en', {
      ignorePunctuation: true,
    }),
  price: (a, b) => a.price - b.price,
  priority: (a, b) => a.priority - b.priority,
  createTime: (a, b) =>
    new Date(a.createTime!).getTime() - new Date(b.createTime!).getTime(),
};

export default function WishlistGrid() {
  const [state, setState] = useState<WishlistGridState>({
    wishlist: [],
  });
  const dispatch = Utils.createDispatch(setState);

  const { sortProperty } = useSelector(
    (state: AppState) => state.local.wishlist,
  );
  const { error } = useSWR<Required<WishlistDAO>[]>(
    '/api/wishlist',
    Utils.request,
    {
      revalidateOnFocus: false,
      onSuccess: (data) => {
        dispatch({ wishlist: data });
      },
    },
  );

  useEffect(() => {
    dispatch({ wishlist: state.wishlist.sort(SORT_BY[sortProperty]) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortProperty, state.wishlist]);

  return (
    <WL.Main.Container>
      <WL.Main.Grid>
        {!error &&
          state.wishlist.map((wishlistItem) => {
            return (
              <WishlistGridItem
                key={wishlistItem.id}
                wishlistItem={wishlistItem}
              />
            );
          })}
      </WL.Main.Grid>
      <WishlistToolbar />
    </WL.Main.Container>
  );
}

/**
 * A memoised grid wishlist item.
 */
const WishlistGridItem = React.memo(
  ({ wishlistItem }: WishlistGridItemProps) => {
    const [, setContext] = useContext(WishlistPageContext);
    const consign = Utils.createDispatch(setContext);
    const Alerts = useContext(Contexts.Alerts);

    const { data: session, status } = useSession();
    const email = session?.user?.email;

    /** Memoise variables relating to reservees. */
    const { isClaimedByUser, numberOfItemsClaimed } = useMemo(() => {
      let isClaimedByUser = false;
      if (email) {
        isClaimedByUser = Object.keys(wishlistItem.reservees).includes(email);
      }

      const numberOfItemsClaimed = Object.values(wishlistItem.reservees).reduce(
        (acc, { quantity }) => {
          return acc + quantity;
        },
        0,
      );

      return { isClaimedByUser, numberOfItemsClaimed };
    }, [email, wishlistItem.reservees]);

    /**
     * Opens the form and populates fields with the information of the item clicked.
     */
    function onEditIconClick() {
      consign({
        isFormTrayOpen: true,
        selectedWishlistItem: wishlistItem,
        wishlistItem,
      });
    }

    /**
     * Prompts to delete the focused wishlist item.
     */
    function onDeleteIconClick() {
      consign({
        isDeletePromptVisible: true,
        selectedWishlistItem: wishlistItem,
      });
    }

    /**
     * Opens the link in a new tab for the focused wishlist item.
     */
    function onVisitLinkClick() {
      window.open(wishlistItem.href, '_blank', 'noopener,noreferrer');
    }

    /**
     * Claims an item by assigning a reservee to it.
     */
    function onClaimButtonClick() {
      if (status !== 'authenticated' || !email) {
        return signIn('google');
      }

      consign({
        isClaimPromptVisible: true,
        selectedWishlistItem: wishlistItem,
      });
    }

    /**
     * Removes a claim on an item.
     */
    async function unclaimItem() {
      try {
        if (!email) {
          throw new Error('You are not logged in.');
        }

        await Utils.request<UnclaimWishlistItemPayload>('/api/wishlist/claim', {
          method: 'DELETE',
          body: {
            id: wishlistItem.id!,
            email,
          },
        });
        await mutate('/api/wishlist');
      } catch (e: any) {
        Alerts.error(e.message);
      }
    }

    return (
      <WL.Main.Cell image={wishlistItem.image}>
        <AdminLock>
          <WL.Main.CrudControls>
            <Clickable.Icon icon={faPen} onClick={onEditIconClick} />
            <Clickable.Icon icon={faTrashAlt} onClick={onDeleteIconClick} />
          </WL.Main.CrudControls>
        </AdminLock>
        <WL.Main.CellImageContainer onClick={onVisitLinkClick}>
          <WL.Main.ItemCellImage
            src={wishlistItem.image}
            alt={wishlistItem.name}
            loading={'lazy'}
          />
        </WL.Main.CellImageContainer>
        <WL.Main.CellContent>
          <WL.Main.ItemName>{wishlistItem.name}</WL.Main.ItemName>
          <WL.Main.ItemPrice>
            {wishlistItem.price.toLocaleString('en-GB', {
              style: 'currency',
              currency: 'GBP',
            })}
            &nbsp;
          </WL.Main.ItemPrice>
          <WL.Main.ItemQuantity>
            {wishlistItem.quantity}&nbsp;wanted
          </WL.Main.ItemQuantity>
          <WL.Main.ItemReservees
            complete={numberOfItemsClaimed === wishlistItem.quantity}>
            ({numberOfItemsClaimed} out of {wishlistItem.quantity} claimed)
          </WL.Main.ItemReservees>
          <WL.Main.ItemCellFooter>
            <WL.Main.ItemCellFooterButton
              onClick={onVisitLinkClick}
              color={'#50425d'}>
              Visit link
            </WL.Main.ItemCellFooterButton>
            {isClaimedByUser ? (
              <WL.Main.ItemCellFooterButton
                onClick={unclaimItem}
                color={'#883e69'}>
                Unclaim
              </WL.Main.ItemCellFooterButton>
            ) : (
              <WL.Main.ItemCellFooterButton
                onClick={onClaimButtonClick}
                color={THEME.dark.button.cancel}>
                Claim
              </WL.Main.ItemCellFooterButton>
            )}
          </WL.Main.ItemCellFooter>
        </WL.Main.CellContent>
      </WL.Main.Cell>
    );
  },
  (a, b) => a.wishlistItem.id === b.wishlistItem.id,
);

interface WishlistGridState {
  wishlist: WishlistDAO[];
}

interface WishlistGridItemProps {
  wishlistItem: WishlistDAO;
}
