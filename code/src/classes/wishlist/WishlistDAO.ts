import type { EntityDAO } from 'classes/entity';

namespace WishlistDAO {
  export interface Request extends EntityDAO {
    name: string;
    price: number;
    quantity: number;
    visibility: Visibility;
    priority: Priority;
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

  export enum Priority {
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
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
