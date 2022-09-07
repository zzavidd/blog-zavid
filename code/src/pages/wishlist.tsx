import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import type WishlistDAO from 'classes/wishlist/WishlistDAO';
import {
  Tabler,
  TablerColumnHeader as TCH,
  TablerFieldType,
  TablerItemCell as TIC,
} from 'components/library';
import { SITE_TITLE } from 'constants/settings';
import type { PathDefinition } from 'constants/types';
import PageMetadata from 'fragments/PageMetadata';
import SSR from 'private/ssr';

// eslint-disable-next-line react/function-component-definition
const WishlistPage: NextPage<WishlistPageProps> = ({
  pathDefinition,
  pageProps,
}) => {
  const { wishlist } = pageProps;
  return (
    <React.Fragment>
      <PageMetadata {...pathDefinition} />
      <Tabler<7>
        heading={'Wishlist'}
        emptyMessage={'No items on wishlist.'}
        columns={[
          new TCH('#', { centerAlign: true }),
          new TCH('Name'),
          new TCH('Image', { centerAlign: true }),
          new TCH('Comments'),
          new TCH('Price'),
          new TCH('Quantity'),
          new TCH('Claimed?'),
        ]}
        distribution={['6%', '1fr', '10%', '1fr', '10%', '10%', '10%']}
        itemsLoaded={true}
        items={wishlist.map((wishlistItem, key) => {
          return [
            new TIC(wishlist.length - key, { type: TablerFieldType.INDEX }),
            new TIC(wishlistItem.name, { icon: 'tags' }),
            new TIC(
              (
                <img
                  src={wishlistItem.image}
                  alt={wishlistItem.name}
                  style={{ width: '100%' }}
                />
              ),
              {
                type: TablerFieldType.IMAGE,
              },
            ),
            new TIC(wishlistItem.comments, {
              icon: 'comment',
              hideOnMobile: true,
            }),
            new TIC(wishlistItem.price, { icon: 'dollar-sign' }),
            new TIC(wishlistItem.quantity, { icon: 'weight-hanging' }),
            new TIC(wishlistItem.reservees, { icon: 'weight-hanging' }),
          ];
        })}
      />
    </React.Fragment>
  );
};

export const getServerSideProps: GetServerSideProps<
  WishlistPageProps
> = async ({ query }) => {
  const wishlist = JSON.parse(await SSR.Wishlist.getAll(query));
  return {
    props: {
      pathDefinition: {
        title: `Wishlist | ${SITE_TITLE}`,
        description:
          'Be the first to know when a new post or diary entry drops.',
        url: '/wishlist',
      },
      pageProps: {
        wishlist,
      },
    },
  };
};

export default WishlistPage;

interface WishlistPageProps {
  pathDefinition: PathDefinition;
  pageProps: {
    wishlist: WishlistDAO.Response[];
  };
}
