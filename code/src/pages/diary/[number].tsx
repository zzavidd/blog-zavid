import { FavoriteRounded as FavoriteRoundedIcon } from '@mui/icons-material';
import type { Theme } from '@mui/material';
import {
  Container,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { DiaryStatus } from '@prisma/client';
import type { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import invariant from 'tiny-invariant';

import { DiaryStatic } from 'classes/diary/DiaryStatic';
import ShareBlock from 'components/ShareBlock';
import Breadcrumbs from 'componentsv2/Breadcrumbs';
import { Signature } from 'componentsv2/Image';
import Paragraph from 'componentsv2/Typography/Paragraph';
import Time from 'componentsv2/Typography/Time';
import Logger from 'constants/logger';
import Settings from 'constants/settings';
import Layout from 'fragments/Layout';
import MenuProvider from 'fragments/shared/MenuProvider';
import ZString from 'lib/string';
import * as ZText from 'lib/text';
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';
import { getServerSideHelpers } from 'utils/ssr';
import { trpc } from 'utils/trpc';

const DiaryEntryPage: NextPageWithLayout<DiaryEntryPageProps> = ({
  entryNumber,
}) => {
  const { data: diaryTriplet, error } = trpc.diary.findMany.useQuery({
    where: {
      entryNumber: { in: [entryNumber, entryNumber - 1, entryNumber + 1] },
    },
  });
  const isMobile = useMediaQuery<Theme>((t) => t.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  }, [enqueueSnackbar, error]);

  if (!diaryTriplet) return null;
  const [, diaryEntry] = diaryTriplet;

  const title = DiaryStatic.getTitle(diaryEntry);

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Diary', href: '/diary' },
    { label: `#${diaryEntry.entryNumber}: ${diaryEntry.title}` },
  ];
  return (
    <MenuProvider title={DiaryStatic.getTitle(diaryEntry)}>
      <Container maxWidth={'sm'} sx={{ padding: (t) => t.spacing(4) }}>
        <Stack spacing={4} divider={<Divider />}>
          <Breadcrumbs links={links} />
          <Stack spacing={2}>
            <Time
              variant={'body2'}
              textAlign={isMobile ? 'left' : 'center'}
              date={diaryEntry.date}
            />
            <Typography variant={'h2'} textAlign={isMobile ? 'left' : 'center'}>
              {title}
            </Typography>
            {diaryEntry.isFavourite ? (
              <Stack
                direction={'row'}
                alignItems={'center'}
                spacing={1}
                justifyContent={isMobile ? 'flex-start' : 'center'}>
                <FavoriteRoundedIcon color={'primary'} fontSize={'small'} />
                <Typography variant={'body2'}>
                  This diary entry is a personal Zavid favourite.
                </Typography>
              </Stack>
            ) : null}
          </Stack>
          <Stack spacing={5}>
            <Paragraph>{diaryEntry.content}</Paragraph>
            <Signature width={180} />
            <Paragraph>{diaryEntry.footnote}</Paragraph>
          </Stack>
          <ShareBlock
            headline={'Share This Diary Entry'}
            message={`Read "${DiaryStatic.getTitle(diaryEntry)}" on ZAVID`}
          />
        </Stack>
      </Container>
    </MenuProvider>
  );
};

export const getServerSideProps: GetServerSideProps<
  DiaryEntryPageProps
> = async (ctx) => {
  try {
    const { query, req, res } = ctx;
    const entryNumber = Number(query.number);

    const helpers = getServerSideHelpers(ctx);
    const [, entry] = await helpers.diary.custom.triple.fetch(entryNumber);

    const session = await unstable_getServerSession(req, res, nextAuthOptions);
    const isAdmin =
      session && session.user?.email === process.env.NEXT_PUBLIC_GOOGLE_EMAIL;
    const isVisibleToAll =
      entry.status === DiaryStatus.PUBLISHED ||
      entry.status === DiaryStatus.PRIVATE;
    const isVisibleToAdmin = isAdmin && entry.status === DiaryStatus.PROTECTED;
    invariant(isVisibleToAll || isVisibleToAdmin, 'No diary entry found.');

    if (entry.status !== DiaryStatus.PUBLISHED) {
      res.setHeader('X-Robots-Tag', 'noindex');
    }

    return {
      props: {
        entryNumber,
        pathDefinition: {
          title: `Diary Entry #${entry.entryNumber}: ${entry.title} | ${Settings.SITE_TITLE}`,
          description: ZText.extractExcerpt(entry.content),
          url: `/diary/${entry.entryNumber}`,
          article: {
            publishedTime: entry.date!.toDateString(),
            tags: ZString.convertCsvToArray(entry.tags as string[]),
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
  entryNumber: number;
}
