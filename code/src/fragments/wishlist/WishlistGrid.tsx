import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { signIn, useSession } from 'next-auth/react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import useSWR, { mutate } from 'swr';

import type WishlistDAO from 'classes/wishlist/WishlistDAO';
import { WishlistItemPriority } from 'classes/wishlist/WishlistDAO';
import Clickable from 'components/Clickable';
import Contexts from 'constants/contexts';
import type { AppState } from 'constants/reducers';
import Utils from 'constants/utils';
import AdminLock from 'fragments/AdminLock';
import ZString from 'lib/string';
import type { UnclaimWishlistItemPayload } from 'private/api/wishlist';
import WL from 'styles/Pages/Wishlist.styles';
import { THEME } from 'styles/Variables.styles';

import { WishlistPageContext } from './WishlistContext';
import { SORT_BY } from './WishlistSort';
import WishlistToolbar from './WishlistToolbar';

export default function WishlistGrid() {
  const [state, setState] = useState<WishlistGridState>({
    wishlist: [],
  });
  const dispatch = Utils.createDispatch(setState);

  const { sortProperty, sortOrderAscending } = useSelector(
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
    const sortFunction =
      SORT_BY[sortProperty][sortOrderAscending ? 'asc' : 'desc'];
    const sortedList = state.wishlist.sort(sortFunction);
    dispatch({ wishlist: sortedList });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortProperty, sortOrderAscending, state.wishlist]);

  return (
    <WL.Main.Container>
      <WL.Main.PageDetails>
        <WL.Main.Title>Zavid&#39;s Wishlist</WL.Main.Title>
        <WL.Main.Summary>
          Consider this my own personal purchase log which simultaneously serves
          as a registry for the ones who show love through gifts. The idea is to
          channel your love so that it is both thoughtful and well-received.
          Consider anything on this list nectar to my soul. Please note that
          prices are subject to fluctuation.
        </WL.Main.Summary>
        <WL.Main.SummarySuffix>
          My birthday is the <strong>2nd December</strong>, by the way. 👀
        </WL.Main.SummarySuffix>
      </WL.Main.PageDetails>
      <WishlistToolbar />
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

    const priority = ZString.capitalise(
      WishlistItemPriority[wishlistItem.priority],
    );

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
        Alerts.success(
          `You have removed your claim on "${wishlistItem.name}".`,
        );
      } catch (e: any) {
        Alerts.error(e.message);
      }
    }

    const allQuantityClaimed = numberOfItemsClaimed === wishlistItem.quantity;

    return (
      <WL.Main.Item image={wishlistItem.image}>
        <AdminLock>
          <WL.Main.CrudControlBox>
            <Clickable.Icon icon={faPen} onClick={onEditIconClick} />
            <Clickable.Icon icon={faTrashAlt} onClick={onDeleteIconClick} />
          </WL.Main.CrudControlBox>
        </AdminLock>
        <WL.Main.ItemImageBox onClick={onVisitLinkClick}>
          <WL.Main.ItemImage
            src={wishlistItem.image}
            alt={wishlistItem.name}
            loading={'lazy'}
          />
        </WL.Main.ItemImageBox>
        <WL.Main.ItemDetails
          claimed={allQuantityClaimed}
          purchased={!!wishlistItem.purchaseDate}>
          <div>
            {!wishlistItem.purchaseDate ? (
              <WL.Main.ItemPriority priority={wishlistItem.priority}>
                {priority}
              </WL.Main.ItemPriority>
            ) : null}
            <WL.Main.ItemName>{wishlistItem.name}</WL.Main.ItemName>
          </div>
          <WL.Main.ItemSubBox>
            <WL.Main.ItemPrice>
              <span>
                {wishlistItem.price.toLocaleString('en-GB', {
                  style: 'currency',
                  currency: 'GBP',
                })}
              </span>
              <WL.Main.ItemCategory>
                &nbsp;•&nbsp;{wishlistItem.category}
              </WL.Main.ItemCategory>
            </WL.Main.ItemPrice>
            {!wishlistItem.purchaseDate ? (
              <React.Fragment>
                <WL.Main.ItemQuantity>
                  {wishlistItem.quantity}&nbsp;wanted
                </WL.Main.ItemQuantity>
                <WL.Main.ItemReservees complete={allQuantityClaimed}>
                  {numberOfItemsClaimed} out of {wishlistItem.quantity} claimed
                </WL.Main.ItemReservees>
              </React.Fragment>
            ) : (
              <WL.Main.ItemPurchasedText>
                Already purchased.
              </WL.Main.ItemPurchasedText>
            )}
          </WL.Main.ItemSubBox>
          <WL.Main.ItemCellFooter>
            <WL.Main.ItemCellFooterButton
              onClick={onVisitLinkClick}
              color={'#50425d'}>
              Visit link
            </WL.Main.ItemCellFooterButton>
            {wishlistItem.purchaseDate ||
            (allQuantityClaimed &&
              !isClaimedByUser) ? null : isClaimedByUser ? (
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
        </WL.Main.ItemDetails>
      </WL.Main.Item>
    );
  },
  (a, b) => a.wishlistItem === b.wishlistItem,
);

interface WishlistGridState {
  wishlist: WishlistDAO[];
}

interface WishlistGridItemProps {
  wishlistItem: WishlistDAO;
}
