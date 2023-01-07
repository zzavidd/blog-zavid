import { WishlistAPI } from '@ziventi/wishlist/server';

import WishlistClaimEmail from 'private/emails/templatesv2/wishlist';

export default WishlistAPI({ claimEmail: WishlistClaimEmail }).claim;
