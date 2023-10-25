import type { GetServerSideProps } from 'next';
import { useState } from 'react';

import Layout from 'fragments/Layout';
import {
  InitialWishlistState,
  WishlistContext,
} from 'fragments/Pages/Wishlist/WishlistContext';
import WishlistIndex from 'fragments/Pages/Wishlist/WishlistIndex';
import Settings from 'utils/settings';
import { getServerSideHelpers } from 'utils/ssr';

const WishlistPage: NextPageWithLayout<WishlistPageProps> = (props) => {
  const context = useState(InitialWishlistState);
  return (
    <WishlistContext.Provider value={context}>
      <WishlistIndex {...props} />
    </WishlistContext.Provider>
  );
};

export const getServerSideProps: GetServerSideProps<WishlistPageProps> = async (
  ctx,
) => {
  const categoryParams: WishlistCategoryFindManyInput = {
    include: {
      _count: true,
    },
  };

  const helpers = getServerSideHelpers(ctx);
  await helpers.page.find.prefetch({ where: { slug: 'wishlist' } });

  await helpers.wishlistCategory.findMany.prefetch(categoryParams);

  return {
    props: {
      categoryParams,
      pathDefinition: {
        title: `Zavid's Wishlist | ${Settings.SITE_TITLE}`,
        description: 'Consider anything on here nectar to my soul.',
        url: '/wishlist',
      },
      trpcState: helpers.dehydrate(),
    },
  };
};

WishlistPage.getLayout = Layout.addPartials;
export default WishlistPage;
