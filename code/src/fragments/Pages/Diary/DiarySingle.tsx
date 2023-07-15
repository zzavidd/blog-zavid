import {
  ChevronLeft,
  ChevronRight,
  Edit,
  FavoriteRounded as FavoriteRoundedIcon,
} from '@mui/icons-material';
import type { LinkProps } from '@mui/material';
import { Chip, Container, Divider, Stack, Typography } from '@mui/material';

import Breadcrumbs from 'components/Breadcrumbs';
import { Signature } from 'components/Image';
import { Link, LinkIconButton } from 'components/Link';
import ShareBlock from 'components/ShareBlock';
import Paragraph from 'components/Typography/Paragraph';
import Time from 'components/Typography/Time';
import { AdminLock } from 'fragments/AdminGateway';
import CategoryDisplay from 'fragments/Pages/Diary/CategoryDisplay';
import MenuProvider from 'fragments/Shared/MenuProvider';
import PagePlaceholder from 'fragments/Shared/Placeholders/PagePlaceholder';
import { DiaryTitleFormat, formatDiaryEntryTitle } from 'utils/functions';
import { trpc } from 'utils/trpc';

export default function DiarySingle(props: DiaryEntryPageProps) {
  const { data: diaryEntry } = trpc.diary.find.useQuery(props.params);
  if (!diaryEntry) return <PagePlaceholder />;

  const halfTitle = formatDiaryEntryTitle(diaryEntry, DiaryTitleFormat.Partial);
  const fullTitle = formatDiaryEntryTitle(diaryEntry);

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Diary', href: '/diary' },
    { label: halfTitle },
  ];
  const pageCuratorInfo: PageCuratorInfo = {
    title: fullTitle,
    date: diaryEntry.date!,
    categories: diaryEntry.categories,
  };
  return (
    <MenuProvider info={pageCuratorInfo}>
      <Container maxWidth={'sm'} sx={{ padding: (t) => t.spacing(2, 4, 4) }}>
        <Stack spacing={4} divider={<Divider />}>
          <Stack alignContent={'center'} spacing={4}>
            <Breadcrumbs links={links} />
            <DiaryNavigation {...props} />
          </Stack>
          <Stack spacing={2} position={'relative'} useFlexGap={true}>
            <AdminLock>
              <LinkIconButton
                href={`/admin/diary/edit/${diaryEntry.id}`}
                sx={{ position: 'absolute', top: 0, right: 0 }}>
                <Edit color={'primary'} />
              </LinkIconButton>
            </AdminLock>
            <Time
              variant={'body2'}
              textAlign={{ xs: 'left', md: 'center' }}
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
                justifyContent={{ xs: 'flex-start', md: 'center' }}
                mt={{ xs: 2, md: 0 }}>
                <FavoriteRoundedIcon color={'primary'} fontSize={'small'} />
                <Typography variant={'body2'} fontSize={{ xs: 12, md: 14 }}>
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
            <DiaryNavigation {...props} />
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
}

function DiaryNavigation({ previousParams, nextParams }: DiaryEntryPageProps) {
  const { data: previous } = trpc.diary.find.useQuery(previousParams);
  const { data: next } = trpc.diary.find.useQuery(nextParams);

  const linkProps: LinkProps = {
    color: 'inherit',
    fontSize: { xs: 11, md: 12 },
    fontWeight: 500,
    lineHeight: 1.4,
  };

  if (!previous && !next) return null;

  return (
    <Stack direction={'row'} justifyContent={'space-between'} spacing={4}>
      {previous ? (
        <Stack direction={'row'} alignItems={'center'} spacing={1} flex={1}>
          <ChevronLeft />
          <Link href={`/diary/${previous.entryNumber}`} {...linkProps}>
            <Typography {...linkProps} color={'primary'} fontWeight={900}>
              Diary Entry #{previous.entryNumber}:
            </Typography>
            {previous.title}
          </Link>
        </Stack>
      ) : null}
      {next ? (
        <Stack
          direction={'row'}
          alignItems={'center'}
          justifyContent={'flex-end'}
          spacing={1}
          flex={1}>
          <Link
            href={`/diary/${next.entryNumber}`}
            {...linkProps}
            textAlign={'right'}>
            <Typography {...linkProps} color={'primary'} fontWeight={900}>
              Diary Entry #{next.entryNumber}:
            </Typography>
            {next.title}
          </Link>
          <ChevronRight />
        </Stack>
      ) : null}
    </Stack>
  );
}

export interface DiaryEntryPageProps extends AppPageProps {
  params: DiaryFindInput;
  nextParams: DiaryFindInput;
  previousParams: DiaryFindInput;
}
