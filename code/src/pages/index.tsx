import { Container, Divider, Stack } from '@mui/material';
import { createServerSideHelpers } from '@trpc/react-query/server';
import type { GetServerSideProps } from 'next';
import superjson from 'superjson';

import Settings from 'constants/settings';
import LatestDiaryEntry from 'fragments/home/HomeDiary';
import Introduction from 'fragments/home/HomeIntroduction';
import LatestReverie from 'fragments/home/HomeReverie';
import Layout from 'fragments/Layout';
import { appRouter } from 'server/routers/_app';

const HomePage: NextPageWithLayout<AppPageProps> = () => {
  return (
    <Container maxWidth={'md'} sx={{ padding: (t) => t.spacing(5) }}>
      <Stack spacing={6} divider={<Divider />}>
        <Introduction />
        <LatestDiaryEntry />
        <LatestReverie />
      </Stack>
      {/* <RandomPostsGrid posts={[]} /> */}
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<AppPageProps> = async (
  ctx,
) => {
  const helpers = createServerSideHelpers({
    ctx,
    router: appRouter,
    transformer: superjson,
  });

  await helpers.getHomePageContent.prefetch();

  return {
    props: {
      pathDefinition: {
        title: `${Settings.SITE_TITLE}: ${Settings.SITE_TAGLINE}`,
        description: 'Explore the metaphysical manifestation of my mind.',
        url: '/',
      },
      trpcState: helpers.dehydrate(),
    },
  };
};

HomePage.getLayout = Layout.addPartials;
export default HomePage;
