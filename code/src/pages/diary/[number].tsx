import {
  Edit,
  FavoriteRounded as FavoriteRoundedIcon,
} from '@mui/icons-material';
import type { Theme } from '@mui/material';
import {
  Chip,
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

import Breadcrumbs from 'components/Breadcrumbs';
import { Signature } from 'components/Image';
import { LinkIconButton } from 'components/Link';
import ShareBlock from 'components/ShareBlock';
import Paragraph from 'components/Typography/Paragraph';
import Time from 'components/Typography/Time';
import { AdminLock } from 'fragments/AdminGateway';
import Layout from 'fragments/Layout';
import CategoryDisplay from 'fragments/Pages/Diary/CategoryDisplay';
import MenuProvider from 'fragments/Shared/MenuProvider';
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';
import ZString from 'utils/lib/string';
import * as ZText from 'utils/lib/text';
import Logger from 'utils/logger';
import Settings from 'utils/settings';
import { getServerSideHelpers } from 'utils/ssr';
import { trpc } from 'utils/trpc';

const DiaryEntryPage: NextPageWithLayout<DiaryEntryPageProps> = ({
  entryNumber,
}) => {
  const { data: diaryEntry, error } = trpc.diary.find.useQuery({
    params: {
      include: { categories: true },
      where: { entryNumber },
    },
  });
  const isMobile = useMediaQuery<Theme>((t) => t.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  }, [enqueueSnackbar, error]);

  // TODO: Skeleton
  if (!diaryEntry) return null;

  const halfTitle = `#${diaryEntry.entryNumber}: ${diaryEntry.title}`;
  const fullTitle = `Diary Entry #${diaryEntry.entryNumber}: ${diaryEntry.title}`;

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Diary', href: '/diary' },
    { label: halfTitle },
  ];
  return (
    <MenuProvider title={fullTitle}>
      <Container maxWidth={'sm'} sx={{ padding: (t) => t.spacing(4) }}>
        <Stack spacing={4} divider={<Divider />}>
          <Breadcrumbs links={links} />
          <Stack spacing={2} position={'relative'}>
            <AdminLock>
              <LinkIconButton
                href={`/admin/diary/edit/${diaryEntry.id}`}
                sx={{ position: 'absolute', top: 0, right: 0 }}>
                <Edit color={'primary'} />
              </LinkIconButton>
            </AdminLock>
            <Time
              variant={'body2'}
              textAlign={isMobile ? 'left' : 'center'}
              date={diaryEntry.date}
            />
            <Typography variant={'h2'} textAlign={{ xs: 'left', sm: 'center' }}>
              {fullTitle}
            </Typography>
            <CategoryDisplay
              categories={diaryEntry.categories}
              justifyContent={{ xs: 'flex-start', md: 'center' }}
              py={{ xs: 0, md: 1 }}
            />
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
            <Paragraph variant={'text'} dataTestId={'zb.diary.content'}>
              {diaryEntry.content}
            </Paragraph>
            <Signature width={180} />
            <Paragraph variant={'text'}>{diaryEntry.footnote}</Paragraph>
            <Stack
              direction={'row'}
              spacing={2}
              flexWrap={'wrap'}
              useFlexGap={true}>
              {(diaryEntry.tags as string[]).map((tag, index) => (
                <Chip
                  label={tag}
                  variant={'filled'}
                  sx={{ px: 1, py: 4 }}
                  key={index}
                />
              ))}
            </Stack>
          </Stack>
          <ShareBlock
            headline={'Share This Diary Entry'}
            message={`Read "${halfTitle}" on ZAVID`}
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
    const entry = await helpers.diary.find.fetch({
      params: { where: { entryNumber } },
    });
    invariant(entry, 'No diary entry found.');

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
