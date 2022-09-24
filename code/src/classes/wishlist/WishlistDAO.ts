import type { EntityDAO } from 'classes/entity';

namespace WishlistDAO {
  export interface Request extends EntityDAO {
    name: string;
    quantity: number;
    price: number;
    comments: string;
    image: string;
    href: string;
    reservees: Reservees;
  }

  export interface Response extends Request {
    readonly id: number;
    readonly createTime: Date;
  }
}

export type Reservees = Record<
  string,
  {
    quantity: number;
    anonymous: boolean;
  }
>;

export default WishlistDAO;
