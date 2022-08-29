import { getLatestDiaryEntry } from './diary';
import { getPageBySlug } from './pages';
import { getLatestReverie, getRandomPosts } from './posts';
import { getAllSubscribers } from './subscribers';

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
