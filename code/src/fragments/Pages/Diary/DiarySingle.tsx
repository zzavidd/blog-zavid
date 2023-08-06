import { FavoriteRounded } from '@mui/icons-material';
import { Chip, Stack, Typography } from '@mui/material';
import React from 'react';

import type { BreadcrumbLink } from 'components/Breadcrumbs';
import ShareBlock from 'components/ShareBlock';
import Paragraph from 'components/Typography/Paragraph';
import CategoryDisplay from 'fragments/Pages/Diary/CategoryDisplay';
import ContentSingle, {
  ContentNavigation,
} from 'fragments/Shared/ContentSingle';
import PagePlaceholder from 'fragments/Shared/Placeholders/PagePlaceholder';
import {
  DiaryTitleFormat,
  createDiaryNavigationInfo,
  formatDiaryEntryTitle,
} from 'utils/functions';
import { trpc } from 'utils/trpc';

export default function DiarySingle({
  params,
  previousParams,
  nextParams,
}: DiaryEntryPageProps) {
  const { data: diaryEntry } = trpc.diary.find.useQuery(params);
  const { data: previous } = trpc.diary.find.useQuery(previousParams);
  const { data: next } = trpc.diary.find.useQuery(nextParams);

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
    isFavourite: diaryEntry.isFavourite,
    entity: 'diary entry',
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

  const NavigationProps: ContentNavigationProps = {
    previous: createDiaryNavigationInfo(previous),
    next: createDiaryNavigationInfo(next),
  };

  const ContextExtras = (
    <React.Fragment>
      <Paragraph variant={'text'}>{diaryEntry.footnote}</Paragraph>
      <ContentNavigation {...NavigationProps} />
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
      NavigationProps={NavigationProps}
      TitleExtras={TitleExtras}
      ContentExtras={ContextExtras}
      PageExtras={PageExtras}
    />
  );
}

export interface DiaryEntryPageProps extends AppPageProps {
  params: DiaryFindInput;
  nextParams: DiaryFindInput;
  previousParams: DiaryFindInput;
}
