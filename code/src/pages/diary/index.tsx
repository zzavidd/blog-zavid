import { Container, Divider, Skeleton, Stack, Typography } from '@mui/material';
import type { Grid2Props } from '@mui/material/Unstable_Grid2';
import Grid from '@mui/material/Unstable_Grid2';
import { DiaryStatus } from '@prisma/client';
import type { GetServerSideProps } from 'next';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';

import Paragraph from 'components/Typography/Paragraph';
import Layout from 'fragments/Layout';
import DiaryEachItem, {
  DiaryEachSkeleton,
} from 'fragments/Pages/Diary/DiaryEachItem';
import Settings from 'utils/settings';
import { getServerSideHelpers } from 'utils/ssr';
import { trpc } from 'utils/trpc';

const DIARY_HEADING = "Zavid's Diary";

const DiaryIndex: NextPageWithLayout = () => {
  return (
    <Container maxWidth={false} sx={{ padding: (t) => t.spacing(5, 3) }}>
      <Stack divider={<Divider />} spacing={{ xs: 3, md: 5 }}>
        <Container maxWidth={'sm'}>
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
      <Stack alignItems={'center'} width={'100%'}>
        <Skeleton variant={'text'} width={'100%'} />
        <Skeleton variant={'text'} width={'100%'} />
        <Skeleton variant={'text'} width={'100%'} />
        <Skeleton variant={'text'} width={'80%'} />
      </Stack>
    );
  }

  if (!page) return null;
  return (
    <Paragraph variant={'preamble'} textAlign={'center'}>
      {page.content}
    </Paragraph>
  );
}

/**
 * The list of diary entries displayed in a grid.
 */
function DiaryCollection() {
  const {
    data: diaryEntries,
    error,
    isLoading,
  } = trpc.diary.findMany.useQuery({
    params: {
      orderBy: { entryNumber: 'desc' },
      where: { status: DiaryStatus.PUBLISHED },
    },
    options: {
      contentWordLimit: 25,
    },
  });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  }, [enqueueSnackbar, error]);

  const gridProps: Grid2Props = {
    container: true,
    columns: { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
    columnSpacing: { xs: 3, lg: 5 },
    rowSpacing: 3,
  };

  if (isLoading) {
    return (
      <Grid {...gridProps}>
        {Array(10)
          .fill(null)
          .map((_, key) => (
            <DiaryEachSkeleton key={key} />
          ))}
      </Grid>
    );
  }

  if (!diaryEntries) {
    return (
      <Stack py={9}>
        <Typography variant={'body2'} textAlign={'center'}>
          No diary entries found.
        </Typography>
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
  const helpers = getServerSideHelpers(ctx);
  const page = await helpers.page.find.fetch({
    where: { slug: 'diary' },
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
