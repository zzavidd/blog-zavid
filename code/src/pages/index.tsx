import { Container, Divider, Stack } from '@mui/material';
import { createServerSideHelpers } from '@trpc/react-query/server';
import type { GetServerSideProps } from 'next';
import superjson from 'superjson';

import Settings from 'constants/settings';
import Introduction from 'fragments/home/HomeIntroduction';
import HomeLatest from 'fragments/home/HomeLatest';
import Layout from 'fragments/Layout';
import { appRouter } from 'server/routers/_app';
import { trpc } from 'utils/trpc';

const HomePage: NextPageWithLayout<AppPageProps> = () => {
  const { data: entry, isLoading: isEntryLoading } =
    trpc.getLatestDiaryEntry.useQuery();
  return (
    <Container maxWidth={'md'} sx={{ padding: (t) => t.spacing(5) }}>
      <Stack spacing={6} divider={<Divider />}>
        <Introduction />
        <HomeLatest
          overline={'Latest Diary Entry'}
          title={entry?.title}
          date={entry?.date}
          content={entry?.content}
          isLoading={isEntryLoading}
          moreText={'Read my latest diary entry'}
          moreHref={`/diary/${entry?.entryNumber}`}
        />
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
