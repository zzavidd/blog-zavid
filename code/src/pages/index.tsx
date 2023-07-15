import { Container, Divider, Stack } from '@mui/material';
import type { GetServerSideProps } from 'next';

import Layout from 'fragments/Layout';
import Introduction from 'fragments/Pages/Home/HomeIntroduction';
import HomeLatest from 'fragments/Pages/Home/HomeLatest';
import Settings from 'utils/settings';
import { getServerSideHelpers } from 'utils/ssr';
import { trpc } from 'utils/trpc';

const HomePage: NextPageWithLayout = () => {
  const { data: entry } = trpc.diary.custom.latest.useQuery();

  if (!entry) return null;
  return (
    <Container maxWidth={'md'} sx={{ padding: (t) => t.spacing(6, 5) }}>
      <Stack spacing={{ xs: 5, md: 4 }} divider={<Divider />}>
        <Introduction />
        <HomeLatest
          overline={'Latest Diary Entry'}
          pretitle={`Diary Entry #${entry.entryNumber}:`}
          title={entry.title}
          date={entry.date}
          content={entry.content}
          moreText={'Read my latest diary entry'}
          moreHref={`/diary/${entry?.entryNumber}`}
        />
      </Stack>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<AppPageProps> = async (
  ctx,
) => {
  const helpers = getServerSideHelpers(ctx);
  await helpers.page.find.prefetch({ where: { slug: 'home' } });
  await helpers.diary.custom.latest.prefetch();

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
