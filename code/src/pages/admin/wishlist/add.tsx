import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import type WishlistDAO from 'classes/wishlist/WishlistDAO';
import Alert, { AlertType } from 'constants/alert';
import HandlersV2 from 'constants/handlersv2';
import type { PathDefinition } from 'constants/types';
import Utils from 'constants/utils';
import Validate from 'constants/validations';
import PageMetadata from 'fragments/PageMetadata';
import WishlistForm from 'fragments/wishlist/WishlistForm';

// eslint-disable-next-line react/function-component-definition
const WishlistAdd: NextPage<WishlistAddProps> = ({ pathDefinition }) => {
  const [state, setState] = useState<WishlistAddState>({
    wishlistItem: {
      name: '',
      price: 0,
      comments: '',
      quantity: 1,
      image: '',
      reservees: [],
    },
    isRequestPending: false,
  });
  const router = useRouter();
  const dispatch = Utils.createDispatch(setState);

  async function submitWishlistItem() {
    try {
      dispatch({ isRequestPending: true });
      Validate.wishlistItem(state.wishlistItem);

      await Utils.request('/api/wishlist', {
        method: 'POST',
        body: JSON.stringify({ wishlistItem: state.wishlistItem }),
      });
      Alert.set({
        type: AlertType.SUCCESS,
        message: "You've successfully added a new wishlist item.",
      });
      returnToWishlistPage();
    } catch (e) {
      reportError(e);
    }
  }

  function returnToWishlistPage() {
    void router.push('/wishlist');
  }

  return (
    <React.Fragment>
      <PageMetadata {...pathDefinition} />
      <WishlistForm
        wishlistItem={state.wishlistItem}
        handlers={HandlersV2(setState, 'wishlistItem')}
        isRequestPending={state.isRequestPending}
        confirmFunction={submitWishlistItem}
        confirmButtonText={'Submit'}
        cancelFunction={returnToWishlistPage}
      />
    </React.Fragment>
  );
};

export const getStaticProps: GetStaticProps<WishlistAddProps> = () => {
  return {
    props: {
      pathDefinition: {
        title: 'Add Wishlist Item',
      },
    },
  };
};

export default WishlistAdd;

interface WishlistAddProps {
  pathDefinition: PathDefinition;
}

export interface WishlistAddState {
  wishlistItem: WishlistDAO.Request;
  isRequestPending: boolean;
}
