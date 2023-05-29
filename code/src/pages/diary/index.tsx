import type { Theme } from '@mui/material';
import {
  Container,
  Divider,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import type { Grid2Props } from '@mui/material/Unstable_Grid2';
import Grid from '@mui/material/Unstable_Grid2';
import { DiaryStatus } from '@prisma/client';
import { createServerSideHelpers } from '@trpc/react-query/server';
import type { GetServerSideProps } from 'next';
import SuperJSON from 'superjson';

import Settings from 'constants/settings';
import DiaryEachItem, {
  DiaryEachSkeleton,
} from 'fragments/diary/DiaryEachItem';
import Layout from 'fragments/Layout';
import { appRouter } from 'server/routers/_app';
import { trpc } from 'utils/trpc';

const DIARY_HEADING = "Zavid's Diary";

const DiaryIndex: NextPageWithLayout = () => {
  const isMediumAbove = useMediaQuery<Theme>((t) => t.breakpoints.up('sm'));
  return (
    <Container maxWidth={false} sx={{ padding: (t) => t.spacing(5, 3) }}>
      <Stack divider={<Divider />} spacing={isMediumAbove ? 5 : 3}>
        <Container maxWidth={'md'}>
          <Stack alignItems={'center'} spacing={3}>
            <Typography variant={'h2'} textTransform={'uppercase'}>
              {DIARY_HEADING}
            </Typography>
            <DiaryPagePreamble />
          </Stack>
        </Container>
        <DiaryCollection />
      </Stack>
    </Container>
  );
};

/**
 * The preamble for the diary page.
 */
function DiaryPagePreamble() {
  const { data: page, isLoading } = trpc.page.find.useQuery({
    where: { slug: 'diary' },
  });

  if (isLoading) {
    return (
      <Stack>
        <Skeleton variant={'text'} width={'100%'} />
        <Skeleton variant={'text'} width={'100%'} />
        <Skeleton variant={'text'} width={'100%'} />
        <Skeleton variant={'text'} width={'80%'} />
      </Stack>
    );
  }

  if (!page) return null;
  return (
    <Typography variant={'body1'} textAlign={'center'}>
      {page.content}
    </Typography>
  );
}

/**
 * The list of diary entries displayed in a grid.
 */
function DiaryCollection() {
  const { data: diaryEntries, isLoading } = trpc.diary.findMany.useQuery({
    where: { status: DiaryStatus.PUBLISHED },
    orderBy: { entryNumber: 'desc' },
  });

  const gridProps: Grid2Props = {
    container: true,
    columns: { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
    columnSpacing: { xs: 3, lg: 5 },
    rowSpacing: 3,
  };

  if (isLoading) {
    return (
      <Grid {...gridProps}>
        {Array(8)
          .fill(null)
          .map((_, key) => (
            <DiaryEachSkeleton key={key} />
          ))}
      </Grid>
    );
  }

  if (!diaryEntries) {
    return (
      <Stack>
        <Typography variant={'body2'}>No diary entries found</Typography>
      </Stack>
    );
  }

  return (
    <Grid {...gridProps}>
      {diaryEntries.map((entry) => (
        <DiaryEachItem entry={entry} key={entry.id} />
      ))}
    </Grid>
  );
}

export const getServerSideProps: GetServerSideProps<AppPageProps> = async (
  ctx,
) => {
  const helpers = createServerSideHelpers({
    ctx,
    router: appRouter,
    transformer: SuperJSON,
  });

  const page = await helpers.page.find.fetch({
    where: { slug: 'home' },
  });

  return {
    props: {
      pathDefinition: {
        title: `Diary | ${Settings.SITE_TITLE}`,
        description: page?.excerpt,
        url: '/diary',
      },
      trpcState: helpers.dehydrate(),
    },
  };
};

DiaryIndex.getLayout = Layout.addPartials;
export default DiaryIndex;
