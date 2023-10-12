import type { GetServerSideProps, NextPage } from 'next';
import { SitemapStream, streamToPromise } from 'sitemap';

import { getPublicRoutes } from 'utils/functions/routes';
import Settings from 'utils/settings';

const Sitemap: NextPage = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const routes = await getPublicRoutes();

  const sitemap = new SitemapStream({ hostname: Settings.DOMAIN });
  routes.forEach((route) => sitemap.write(route));
  sitemap.end();

  const buffer = await streamToPromise(sitemap);
  const xml = buffer.toString();

  res.setHeader('Content-Type', 'text/xml');
  res.write(xml);
  res.end();

  return { props: {} };
};

export default Sitemap;
