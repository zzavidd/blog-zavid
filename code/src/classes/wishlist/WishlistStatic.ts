import type WishlistDAO from './WishlistDAO';

export class WishlistStatic {
  /**
   * Ensure a wishlist item is able to be operated on.
   * @param wishlistItem The wishlist item.
   * @returns The parsed wishlist item.
   */
  public static parse(
    wishlistItem: WishlistDAO.Response,
  ): WishlistDAO.Response {
    try {
      wishlistItem.reservees = JSON.parse(wishlistItem.reservees as string);
    } catch {
      wishlistItem.reservees = [];
    }
    return wishlistItem;
  }

  /**
   * Generate a bare wishlist request.
   * @returns The subscription mapping.
   */
  public static initial(): WishlistDAO.Request {
    return {
      name: '',
      price: 0,
      comments: '',
      quantity: 1,
      image: '',
      href: '',
      reservees: [],
    };
  }
}
