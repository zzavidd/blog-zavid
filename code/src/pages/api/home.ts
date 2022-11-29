import type { NextApiRequest, NextApiResponse } from 'next';

import DiaryAPI from 'private/api/diary';
import PostAPI from 'private/api/posts';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
): Promise<void> {
  switch (req.method) {
    case 'GET': {
      const props = await getHomePageContent();
      return res.json(props);
    }
    default: {
      res.send(405);
    }
  }
}

/**
 * Retrieves the preloaded props for the home page.
 * @returns The preloaded props.
 */
async function getHomePageContent(): Promise<HomePageContent> {
  const [latestDiaryEntry, latestReverie] = await Promise.all([
    DiaryAPI.getLatest(),
    PostAPI.getLatestReverie(),
  ]);
  const randomPosts = await PostAPI.getRandomPosts({
    exceptId: latestReverie.id,
  });
  return {
    latestDiaryEntry,
    latestReverie,
    randomPosts,
  };
}
