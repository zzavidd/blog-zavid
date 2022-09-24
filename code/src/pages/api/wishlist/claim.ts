import type { NextApiRequest, NextApiResponse } from 'next';

import WishlistAPI from 'private/api/wishlist';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
): Promise<void> {
  if (req.method !== 'PUT') return res.send(405);

  try {
    await WishlistAPI.claim(req.body);
    res.send(200);
  } catch (e) {
    res.status(400).json(e);
  }
}
