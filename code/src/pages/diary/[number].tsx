import { FavoriteRounded as FavoriteRoundedIcon } from '@mui/icons-material';
import type { Theme } from '@mui/material';
import {
  Container,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';

import { DiaryStatic } from 'classes/diary/DiaryStatic';
import ShareBlock from 'components/ShareBlock';
import Breadcrumbs from 'componentsv2/Breadcrumbs';
import { Signature } from 'componentsv2/Image';
import { Paragraph } from 'componentsv2/Typography/Paragraph';
import { Time } from 'componentsv2/Typography/Time';
import Layout from 'fragments/Layout';
import MenuProvider from 'fragments/shared/MenuProvider';
import { trpc } from 'utils/trpc';

const DiaryEntryPage: NextPageWithLayout<DiaryEntryPageProps> = ({ id }) => {
  const { data: diaryTriplet, error } = trpc.getDiaryTriplet.useQuery(id);
  const isMobile = useMediaQuery<Theme>((t) => t.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  }, [enqueueSnackbar, error]);

  if (!diaryTriplet) return null;
  const { current: diaryEntry } = diaryTriplet;

  const title = DiaryStatic.getTitle(diaryEntry);

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Diary', href: '/diary' },
    { label: `#${diaryEntry.entryNumber}: ${diaryEntry.title}` },
  ];
  return (
    <MenuProvider title={DiaryStatic.getTitle(diaryEntry)}>
      <Container maxWidth={'sm'} sx={{ padding: (t) => t.spacing(4) }}>
        <TopNavigator diaryTriplet={diaryTriplet} />
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

function TopNavigator({ diaryTriplet }: { diaryTriplet?: DiaryTriplet }) {
  if (!diaryTriplet) return null;

  // const { current, previous, next } = diaryTriplet;
  return null;
}

DiaryEntryPage.getLayout = Layout.addPartials;
export default DiaryEntryPage;

interface DiaryEntryPageProps extends AppPageProps {
  id: number;
}
