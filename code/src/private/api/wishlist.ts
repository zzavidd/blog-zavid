import type { QuerySort } from 'classes/_/QueryBuilder';
import type WishlistDAO from 'classes/wishlist/WishlistDAO';
import {
  WishlistMutationBuilder,
  WishlistQueryBuilder,
} from 'classes/wishlist/WishlistQueryBuilder';
import { knex } from 'constants/knex';

namespace WishlistAPI {
  /**
   * Retrieves all wishlist items from database.
   * @param options The get options.
   */
  export function getAll(
    options: GetWishlistParams,
  ): Promise<WishlistDAO.Response[]> {
    const { sort = {} } = options;
    return new WishlistQueryBuilder(knex).withOrder(sort).build();
  }

  export async function getById(id: number): Promise<WishlistDAO.Response> {
    const [wishlistItem] = await new WishlistQueryBuilder(knex)
      .whereId(id)
      .build();
    return wishlistItem;
  }

  export async function create({
    wishlistItem,
  }: CreateWishlistItemPayload): Promise<void> {
    await new WishlistMutationBuilder(knex)
      .insert({
        ...wishlistItem,
        reservees: JSON.stringify(wishlistItem.reservees),
      })
      .build();
  }

  export async function update({
    id,
    wishlistItem,
  }: UpdateWishlistItemPayload): Promise<void> {
    await new WishlistMutationBuilder(knex)
      .update(
        {
          ...wishlistItem,
          reservees: JSON.stringify(wishlistItem.reservees),
        },
        ['createTime'],
      )
      .whereId(id)
      .build();
  }

  export async function del({ id }: UpdateWishlistItemPayload): Promise<void> {
    await new WishlistMutationBuilder(knex).delete(id).build();
  }
}

export default WishlistAPI;

export interface GetWishlistParams {
  sort?: QuerySort<WishlistDAO.Response>;
}

interface CreateWishlistItemPayload {
  wishlistItem: WishlistDAO.Request;
}

interface UpdateWishlistItemPayload {
  id: number;
  wishlistItem: WishlistDAO.Response;
}
