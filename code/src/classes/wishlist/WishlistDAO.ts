import type { EntityDAO } from 'classes/entity';

export default interface WishlistDAO extends EntityDAO {
  name: string;
  price: number;
  quantity: number;
  visibility: WishlistItemVisibility;
  priority: WishlistItemPriority;
  image: string;
  href: string;
  comments: string;
  reservees: Reservees;
  purchaseDate: Date | string | null;
  readonly createTime?: Date;
}

export enum WishlistItemVisibility {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
}

export enum WishlistItemPriority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}

type Reservees = Record<
  string,
  {
    quantity: number;
    anonymous: boolean;
  }
>;
