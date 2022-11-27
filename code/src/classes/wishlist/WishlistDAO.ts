export default interface WishlistDAO {
  id?: number;
  name: string;
  price: number;
  quantity: number;
  category: WishlistItemCategory;
  visibility: WishlistItemVisibility;
  priority: WishlistItemPriority;
  image: string;
  href: string;
  comments: string;
  reservees: Reservees;
  purchaseDate: Date | string | null;
  readonly createTime?: Date;
}

export enum WishlistItemCategory {
  ARTWORK = 'Artwork',
  CLOTHING = 'Clothing',
  CONFECTIONERY = 'Confectionery',
  COSMETICS = 'Cosmetics',
  GAMING = 'Gaming',
  ELECTRONICS = 'Electronics',
  HOUSEHOLD = 'Household',
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

export const WishlistDisplayedPriority = {
  [WishlistItemPriority.LOW]: 'Wanted',
  [WishlistItemPriority.MEDIUM]: 'Desired',
  [WishlistItemPriority.HIGH]: 'Needed',
};

type Reservees = Record<
  string,
  {
    quantity: number;
    anonymous: boolean;
  }
>;
