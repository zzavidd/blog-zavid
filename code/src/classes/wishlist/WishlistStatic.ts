import {
  IWishlistItemVisibility,
  IWishlistItemPriority,
  IWishlistItemCategory,
} from 'constants/enums';

export class WishlistStatic {
  /**
   * Ensure a wishlist item is able to be operated on.
   * @param wishlistItem The wishlist item.
   * @returns The parsed wishlist item.
   */
  public static parse(wishlistItem: WishlistDAO): WishlistDAO {
    try {
      wishlistItem.reservees = JSON.parse(
        wishlistItem.reservees as unknown as string,
      );
    } catch {
      wishlistItem.reservees = {};
    }
    return wishlistItem;
  }

  /**
   * Generate a bare wishlist request.
   * @returns The subscription mapping.
   */
  public static initial(): WishlistDAO {
    return {
      name: '',
      price: 0,
      quantity: 1,
      visibility: IWishlistItemVisibility.PRIVATE,
      priority: IWishlistItemPriority.LOW,
      comments: '',
      image: '',
      category: IWishlistItemCategory.ARTWORK,
      href: '',
      reservees: {},
      purchaseDate: null,
    };
  }
}
