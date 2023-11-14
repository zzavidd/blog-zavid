import { Stack } from '@mui/material';
import React, { useContext, useEffect } from 'react';

import { trpc } from 'utils/trpc';

import { WishlistContext } from './WishlistContext';
import WishlistDrawer from './WishlistDrawer';
import WishlistGrid from './WishlistGrid';
import WishlistToolbar from './WishlistToolbar';

export default function WishlistIndex({ categoryParams }: WishlistPageProps) {
  useCategoryPreload(categoryParams);

  return (
    <React.Fragment>
      <Stack direction={'row'} flex={1}>
        <Stack flex={1}>
          <WishlistGrid />
          <WishlistToolbar />
        </Stack>
        <WishlistDrawer />
      </Stack>
      {/* <ClaimItemModal />
    <DeleteItemModal /> */}
    </React.Fragment>
  );
}

function useCategoryPreload(params: WishlistCategoryFindManyInput) {
  const [, setContext] = useContext(WishlistContext);

  const { data: categories = [] } =
    trpc.wishlistCategory.findMany.useQuery<WishlistCategoryWithCount[]>(
      params,
    );

  useEffect(() => {
    setContext((c) => ({ ...c, categories }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
