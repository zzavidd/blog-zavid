import type { NextApiRequest, NextApiResponse, PageConfig } from 'next';

import { getLatestDiaryEntry } from './diary/latest';
import { getPageBySlug } from './pages/[slug]';
import { getRandomPosts } from './posts/random';
import { getLatestReverie } from './posts/reveries.latest';
import { getAllSubscribers } from './subscribers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
): Promise<void> {
  if (req.method === 'GET') {
    const json = await getHomeProps();
    res.json(json);
  } else {
    res.send(405);
  }
}

export async function getHomeProps() {
  const [homepage, latestDiaryEntry, latestReverie, emailSubscribers] =
    await Promise.all([
      getPageBySlug('home'),
      getLatestDiaryEntry(),
      getLatestReverie(),
      getAllSubscribers(),
    ]);
  const randomPosts = await getRandomPosts({ exceptId: latestReverie.id });
  return JSON.stringify({
    homeText: homepage.content,
    latestDiaryEntry,
    latestReverie,
    randomPosts,
    emailSubCount: emailSubscribers?.length || 0,
  });
}

export const config: PageConfig = {
  api: {
    bodyParser: {
      sizeLimit: '10MB',
    },
    responseLimit: '2GB',
  },
};
