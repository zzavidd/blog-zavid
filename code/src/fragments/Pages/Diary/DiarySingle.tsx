import {
  ChevronLeft,
  ChevronRight,
  FavoriteRounded,
} from '@mui/icons-material';
import type { LinkProps } from '@mui/material';
import { Chip, Stack, Typography } from '@mui/material';
import React from 'react';

import type { BreadcrumbLink } from 'components/Breadcrumbs';
import { Link } from 'components/Link';
import ShareBlock from 'components/ShareBlock';
import Paragraph from 'components/Typography/Paragraph';
import CategoryDisplay from 'fragments/Pages/Diary/CategoryDisplay';
import ContentSingle from 'fragments/Shared/ContentSingle';
import PagePlaceholder from 'fragments/Shared/Placeholders/PagePlaceholder';
import { DiaryTitleFormat, formatDiaryEntryTitle } from 'utils/functions';
import { trpc } from 'utils/trpc';

export default function DiarySingle(props: DiaryEntryPageProps) {
  const { data: diaryEntry } = trpc.diary.find.useQuery(props.params);
  if (!diaryEntry) return <PagePlaceholder />;

  const halfTitle = formatDiaryEntryTitle(diaryEntry, DiaryTitleFormat.Partial);
  const fullTitle = formatDiaryEntryTitle(diaryEntry);

  const links: BreadcrumbLink[] = [
    { label: 'Home', href: '/' },
    { label: 'Diary', href: '/diary' },
    { label: halfTitle },
  ];
  const pageCuratorInfo: PageCuratorInfo = {
    title: fullTitle,
    date: diaryEntry.date,
    categories: diaryEntry.categories,
  };

  const TitleExtras = (
    <React.Fragment>
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
          <FavoriteRounded color={'primary'} fontSize={'small'} />
          <Typography variant={'body2'} fontSize={{ xs: 12, md: 14 }}>
            This diary entry is a personal Zavid favourite.
          </Typography>
        </Stack>
      ) : null}
    </React.Fragment>
  );

  const ContextExtras = (
    <React.Fragment>
      <Paragraph variant={'text'}>{diaryEntry.footnote}</Paragraph>
      <DiaryNavigation {...props} />
      <Stack direction={'row'} spacing={2} flexWrap={'wrap'} useFlexGap={true}>
        {(diaryEntry.tags as string[]).map((tag, index) => (
          <Chip
            label={tag}
            variant={'filled'}
            sx={{ px: 1, py: 4 }}
            key={index}
          />
        ))}
      </Stack>
    </React.Fragment>
  );

  const PageExtras = (
    <ShareBlock
      headline={'Share This Diary Entry'}
      message={`Read "${halfTitle}" on ZAVID`}
    />
  );

  return (
    <ContentSingle
      breadcrumbLinks={links}
      contentTitle={fullTitle}
      contentDate={diaryEntry.date}
      content={diaryEntry.content}
      curatorInfo={pageCuratorInfo}
      dateFirst={true}
      editHref={`/admin/diary/edit/${diaryEntry.id}`}
      Navigation={<DiaryNavigation {...props} />}
      TitleExtras={TitleExtras}
      ContentExtras={ContextExtras}
      PageExtras={PageExtras}
    />
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
