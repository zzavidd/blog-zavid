import { Article, EditNote } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import type { Exclusive } from '@prisma/client';
import { ExclusiveStatus } from '@prisma/client';

import { Link } from 'components/Link';
import ZDate from 'utils/lib/date';

const STATUS_ICONS = {
  [ExclusiveStatus.DRAFT]: EditNote,
  [ExclusiveStatus.PUBLISHED]: Article,
};

/**
 * A hook for retrieving the exclusives table fields and value renderer.
 * @returns The table fields.
 */
export function useExclusivesTableFields(): TableField<Exclusive>[] {
  return [
    {
      title: <Typography variant={'h6'}>#</Typography>,
      property: null,
      renderValue: (_, i) => <Typography variant={'body1'}>{i}</Typography>,
    },
    {
      title: <Typography variant={'h6'}>Title</Typography>,
      property: 'subject',
      align: 'left',
      renderValue: (p) => {
        if (p.status === ExclusiveStatus.PUBLISHED) {
          return (
            <Link
              href={`/exclusives/${p.slug}`}
              variant={'body1'}
              color={'inherit'}
              fontWeight={400}
              underline={'hover'}>
              {p.subject}
            </Link>
          );
        }

        return <Typography variant={'body1'}>{p.subject}</Typography>;
      },
    },
    {
      title: <Typography variant={'h6'}>Preview</Typography>,
      property: 'preview',
      align: 'left',
      renderValue: (e) => (
        <Typography variant={'body1'}>{e.preview}</Typography>
      ),
    },
    {
      title: <Typography variant={'h6'}>Date Published</Typography>,
      property: 'date',
      align: 'left',
      renderValue: (e) => (
        <Typography variant={'body1'}>{ZDate.format(e.date)}</Typography>
      ),
    },
    {
      title: <Typography variant={'h6'}>Status</Typography>,
      property: 'status',
      align: 'left',
      renderValue: (e) => {
        const Icon = STATUS_ICONS[e.status];
        return (
          <Stack direction={'row'} alignItems={'center'} spacing={2}>
            <Icon color={'primary'} />
            <Typography variant={'body1'}>{e.status}</Typography>
          </Stack>
        );
      },
    },
  ];
}
