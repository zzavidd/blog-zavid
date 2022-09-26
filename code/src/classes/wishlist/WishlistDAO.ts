import type { EntityDAO } from 'classes/entity';

namespace WishlistDAO {
  export interface Request extends EntityDAO {
    name: string;
    price: number;
    quantity: number;
    visibility: Visibility;
    image: string;
    href: string;
    comments: string;
    reservees: Reservees;
    purchaseDate: Date | string | null;
  }

  export interface Response extends Request {
    readonly id: number;
    readonly createTime: Date;
  }

  export enum Visibility {
    PRIVATE = 'PRIVATE',
    PUBLIC = 'PUBLIC',
  }
}

type Reservees = Record<
  string,
  {
    quantity: number;
    anonymous: boolean;
  }
>;

export default WishlistDAO;
