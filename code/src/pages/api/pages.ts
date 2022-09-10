import type { NextApiRequest, NextApiResponse } from 'next';

import PageAPI from 'private/api/pages';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
): Promise<void> {
  try {
    switch (req.method) {
      case 'POST': {
        await PageAPI.create(req.body);
        return res.send(201);
      }
      case 'PUT': {
        await PageAPI.update(req.body);
        return res.send(200);
      }
      case 'DELETE': {
        await PageAPI.del(req.body);
        return res.send(204);
      }
      default: {
        res.send(405);
      }
    }
  } catch (e: any) {
    res.status(400).json({
      ...e,
      message: 'sqlMessage' in e ? e.sqlMessage : e.message,
    });
  }
}
