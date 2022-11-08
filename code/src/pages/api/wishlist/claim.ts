import type { NextApiRequest, NextApiResponse } from 'next';

import WishlistAPI from 'private/api/wishlist';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
): Promise<void> {
  try {
    switch (req.method) {
      case 'PUT': {
        await WishlistAPI.claim(req.body);
        return res.send(200);
      }
      case 'DELETE': {
        await WishlistAPI.unclaim(req.body);
        return res.send(200);
      }
      default: {
        res.send(405);
      }
    }
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}
