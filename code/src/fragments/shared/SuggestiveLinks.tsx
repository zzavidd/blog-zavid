import { Circle } from '@mui/icons-material';
import { Stack } from '@mui/material';

import { Link } from 'components/Link';

export default function SuggestiveLinks() {
  return (
    <Stack
      direction={'row'}
      alignItems={'center'}
      divider={
        <Circle color={'primary'} sx={{ fontSize: (t) => t.spacing(2) }} />
      }
      spacing={3}>
      <Link href={'/'} variant={'button'}>
        Home
      </Link>
      <Link href={'/diary'} variant={'button'}>
        Diary
      </Link>
    </Stack>
  );
}
