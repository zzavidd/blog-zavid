import { Container, Stack, Typography } from '@mui/material';
import { useContext } from 'react';

import Paragraph from 'components/Typography/Paragraph';
import { trpc } from 'utils/trpc';

import DiaryCollection from './DiaryCollection';
import { DiaryIndexContext } from './DiaryIndex.utils';
import DiarySearch from './DiarySearch';
import DiaryToolbar from './DiaryToolbar';

const DIARY_HEADING = "Zavid's Diary";

export default function DiaryIndex() {
  return (
    <Container
      maxWidth={false}
      disableGutters={true}
      sx={{ overflow: 'hidden' }}>
      <Stack>
        <Container maxWidth={'sm'}>
          <Stack alignItems={'center'} rowGap={3} px={3} py={5}>
            <Typography variant={'h2'} textTransform={'uppercase'}>
              {DIARY_HEADING}
            </Typography>
            <DiaryPagePreamble />
            <DiarySearch />
          </Stack>
        </Container>
        <DiaryToolbar />
        <Stack alignItems={'center'} spacing={3} px={3} py={5}>
          <DiaryCollection />
        </Stack>
      </Stack>
    </Container>
  );
}

/**
 * The preamble for the diary page.
 */
export function DiaryPagePreamble() {
  const { params } = useContext(DiaryIndexContext);
  const { data: page } = trpc.page.find.useQuery(params);
  if (!page) return null;
  return (
    <Paragraph variant={'preamble'} textAlign={'center'}>
      {page.content}
    </Paragraph>
  );
}

export interface DiaryIndexProps {
  params: PageFindInput;
  searchTerm: string;
}
