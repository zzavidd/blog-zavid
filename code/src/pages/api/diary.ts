import type { NextApiRequest, NextApiResponse } from 'next';

import { QueryOrder, IDiaryStatus } from 'constants/enums';
import DiaryAPI from 'private/api/diary';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
): Promise<void> {
  switch (req.method) {
    case 'GET': {
      const diaryEntries = await DiaryAPI.getAll({
        sort: {
          field: 'date',
          order: QueryOrder.DESCENDING,
        },
        status: { include: [IDiaryStatus.PUBLISHED] },
        onlyFavourites: req.query.favourites === 'true',
      });
      return res.status(200).json(diaryEntries);
    }
    case 'POST': {
      await DiaryAPI.create(req.body);
      return res.send(201);
    }
    case 'PUT': {
      await DiaryAPI.update(req.body);
      return res.send(200);
    }
    case 'DELETE': {
      await DiaryAPI.destroy(req.body);
      return res.send(204);
    }
    default: {
      res.send(405);
    }
  }
}
