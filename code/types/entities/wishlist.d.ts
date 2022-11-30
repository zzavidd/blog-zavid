interface WishlistDAO {
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

interface WishlistClaimRequest {
  quantity: number;
  emailAddress: string;
  isAnonymous: boolean;
  honeypot: string;
}

interface Reservees {
  [key: string]: {
    quantity: number;
    anonymous: boolean;
  };
}

type WishlistItemCategory =
  | 'Artwork'
  | 'Clothing'
  | 'Confectionery'
  | 'Cosmetics'
  | 'Gaming'
  | 'Electronics'
  | 'Household';
type WishlistItemVisibility = 'PRIVATE' | 'PUBLIC';
type WishlistItemPriority = 1 | 2 | 3;
