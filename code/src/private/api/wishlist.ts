import { format } from 'date-fns';

import type { QuerySort } from 'classes/_/QueryBuilder';
import type WishlistDAO from 'classes/wishlist/WishlistDAO';
import {
  WishlistMutationBuilder,
  WishlistQueryBuilder,
} from 'classes/wishlist/WishlistQueryBuilder';
import { WishlistStatic } from 'classes/wishlist/WishlistStatic';
import { knex } from 'constants/knex';

namespace WishlistAPI {
  /**
   * Retrieves all wishlist items from database.
   * @param options The get options.
   */
  export async function getAll(
    options: GetWishlistParams,
  ): Promise<WishlistDAO[]> {
    const { sort = {} } = options;
    const wishlist = await new WishlistQueryBuilder(knex)
      .withOrder(sort)
      .build();
    return wishlist.map(WishlistStatic.parse);
  }

  export async function getById(id: number): Promise<WishlistDAO> {
    const [wishlistItem] = await new WishlistQueryBuilder(knex)
      .whereId(id)
      .build();
    return WishlistStatic.parse(wishlistItem);
  }

  export async function create({
    wishlistItem,
  }: CreateWishlistItemPayload): Promise<void> {
    await new WishlistMutationBuilder(knex)
      .insert({
        ...wishlistItem,
        purchaseDate: wishlistItem.purchaseDate
          ? format(new Date(wishlistItem.purchaseDate), 'yyyy-MM-dd')
          : null,
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
          purchaseDate: wishlistItem.purchaseDate
            ? format(new Date(wishlistItem.purchaseDate), 'yyyy-MM-dd')
            : null,
        },
        ['createTime'],
      )
      .whereId(id)
      .build();
  }

  export async function del({ id }: UpdateWishlistItemPayload): Promise<void> {
    await new WishlistMutationBuilder(knex).delete(id).build();
  }

  export async function claim({
    id,
    email,
    quantity,
    anonymous,
  }: ClaimWishlistItemPayload): Promise<void> {
    const wishlistItem = await getById(id);
    await update({
      id,
      wishlistItem: {
        ...wishlistItem,
        reservees: {
          ...wishlistItem.reservees,
          [email]: {
            quantity,
            anonymous,
          },
        },
      },
    });
  }

  export async function unclaim({
    id,
    email,
  }: UnclaimWishlistItemPayload): Promise<void> {
    const wishlistItem = await getById(id);
    delete wishlistItem.reservees[email];
    await update({ id, wishlistItem });
  }
}

export default WishlistAPI;

export interface GetWishlistParams {
  sort?: QuerySort<WishlistDAO>;
}

interface CreateWishlistItemPayload {
  wishlistItem: WishlistDAO;
}

interface UpdateWishlistItemPayload {
  id: number;
  wishlistItem: WishlistDAO;
}

export interface ClaimWishlistItemPayload {
  id: number;
  email: string;
  quantity: number;
  anonymous: boolean;
}

export interface UnclaimWishlistItemPayload {
  id: number;
  email: string;
}
