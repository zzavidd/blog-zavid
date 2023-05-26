import { FavoriteRounded as FavoriteRoundedIcon } from '@mui/icons-material';
import { Container, Typography } from '@mui/material';
import { DiaryStatus } from '@prisma/client';
import { createServerSideHelpers } from '@trpc/react-query/server';
import type { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import SuperJSON from 'superjson';

import { DiaryStatic } from 'classes/diary/DiaryStatic';
import { Paragraph } from 'components/Text';
import { Signature } from 'componentsv2/Image';
import Logger from 'constants/logger';
import Settings from 'constants/settings';
import Layout from 'fragments/Layout';
import MenuProvider from 'fragments/shared/MenuProvider';
import ZDate from 'lib/date';
import ZString from 'lib/string';
import * as ZText from 'lib/text';
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';
import { appRouter } from 'server/routers/_app';
import { trpc } from 'utils/trpc';

const DiaryEntryPage: NextPageWithLayout<DiaryEntryPageProps> = ({ id }) => {
  const { data: diaryTriplet, error } = trpc.getDiaryTriplet.useQuery(id);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  }, [enqueueSnackbar, error]);

  if (!diaryTriplet) return null;
  const { current: diaryEntry } = diaryTriplet;

  return (
    <MenuProvider title={DiaryStatic.getTitle(diaryEntry)}>
      <Container maxWidth={'sm'} sx={{ padding: (t) => t.spacing(5, 3) }}>
        {/* <TopNavigator diaryTriplet={diaryTriplet} /> */}
        <Typography
          variant={'body1'}
          component={'time'}
          dateTime={ZDate.formatISO(diaryEntry.date)}>
          {ZDate.format(diaryEntry.date)}
        </Typography>
        <Typography variant={'h2'}>
          {DiaryStatic.getTitle(diaryEntry)}
        </Typography>
        {diaryEntry.isFavourite ? (
          <Typography>
            <FavoriteRoundedIcon />
            <span>This diary entry is a personal Zavid favourite.</span>
          </Typography>
        ) : null}
        <Paragraph>{diaryEntry.content}</Paragraph>
        <Signature width={180} />
        <Paragraph>{diaryEntry.footnote}</Paragraph>
        {/* <ShareBlock
        headline={'Share This Diary Entry'}
        message={`Read "${DiaryStatic.getTitle(diaryEntry)}" on ZAVID`}
        url={Settings.DOMAIN + router.asPath}
      /> */}
      </Container>
    </MenuProvider>
  );
};

function TopNavigator({ diaryTriplet }: { diaryTriplet?: DiaryTriplet }) {
  if (!diaryTriplet) return null;

  const { current, previous, next } = diaryTriplet;
  return null;
}

export const getServerSideProps: GetServerSideProps<
  DiaryEntryPageProps
> = async (ctx) => {
  const helpers = createServerSideHelpers({
    ctx,
    router: appRouter,
    transformer: SuperJSON,
  });

  try {
    const { query, req, res } = ctx;

    const id = parseInt(query.number as string);
    const diaryTriplet = await helpers.getDiaryTriplet.fetch(id);
    const entry = diaryTriplet.current;

    const session = await unstable_getServerSession(req, res, nextAuthOptions);
    if (!session && entry.status === DiaryStatus.PROTECTED) {
      throw new Error('No diary entry found.');
    }

    if (entry.status !== DiaryStatus.PUBLISHED) {
      res.setHeader('X-Robots-Tag', 'noindex');
    }

    return {
      props: {
        id,
        pathDefinition: {
          title: `Diary Entry #${entry.entryNumber}: ${entry.title} | ${Settings.SITE_TITLE}`,
          description: ZText.extractExcerpt(entry.content),
          url: `/diary/${entry.entryNumber}`,
          article: {
            publishedTime: new Date(entry.date).toDateString(),
            tags: ZString.convertCsvToArray(entry.tags),
          },
        },
        trpcState: helpers.dehydrate(),
      },
    };
  } catch (e) {
    Logger.error(e);
    return {
      notFound: true,
    };
  }
};

DiaryEntryPage.getLayout = Layout.addPartials;
export default DiaryEntryPage;

interface DiaryEntryPageProps extends AppPageProps {
  id: number;
}
