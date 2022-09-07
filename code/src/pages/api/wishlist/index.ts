import type { NextApiRequest, NextApiResponse } from 'next';

import WishlistAPI from 'private/api/wishlist';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
): Promise<void> {
  try {
    switch (req.method) {
      case 'GET': {
        const params = JSON.parse((req.query?.params as string) || '{}');
        const wishlist = await WishlistAPI.getAll(params);
        return res.status(200).json(wishlist);
      }
      case 'POST': {
        await WishlistAPI.create(req.body);
        return res.send(201);
      }
      default: {
        res.send(405);
      }
    }
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}
