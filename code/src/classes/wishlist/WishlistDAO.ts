import type { EntityDAO } from 'classes/entity';

namespace WishlistDAO {
  export interface Request extends EntityDAO {
    name: string;
    quantity: number;
    price: number;
    comments: string;
    image: string;
    reservees: string | string[];
  }

  export interface Response extends Request {
    readonly id: number;
    readonly createTime: Date;
  }
}

export default WishlistDAO;
