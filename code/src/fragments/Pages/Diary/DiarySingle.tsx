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
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';

import Breadcrumbs from 'components/Breadcrumbs';
import { Signature } from 'components/Image';
import { LinkIconButton } from 'components/Link';
import ShareBlock from 'components/ShareBlock';
import Paragraph from 'components/Typography/Paragraph';
import Time from 'components/Typography/Time';
import { AdminLock } from 'fragments/AdminGateway';
import CategoryDisplay from 'fragments/Pages/Diary/CategoryDisplay';
import MenuProvider from 'fragments/Shared/MenuProvider';
import PagePlaceholder from 'fragments/Shared/Placeholders/PagePlaceholder';
import { trpc } from 'utils/trpc';

export default function DiarySingle({ params }: DiaryEntryPageProps) {
  const { data: diaryEntry, error } = trpc.diary.find.useQuery(params);
  const isMobile = useMediaQuery<Theme>((t) => t.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  }, [enqueueSnackbar, error]);

  if (!diaryEntry) return <PagePlaceholder />;

  const halfTitle = `#${diaryEntry.entryNumber}: ${diaryEntry.title}`;
  const fullTitle = `Diary Entry #${diaryEntry.entryNumber}: ${diaryEntry.title}`;

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
      <Container maxWidth={'sm'} sx={{ padding: (t) => t.spacing(4) }}>
        <Stack spacing={4} divider={<Divider />}>
          <Breadcrumbs links={links} />
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
}

export interface DiaryEntryPageProps extends AppPageProps {
  params: DiaryFindInput;
}
