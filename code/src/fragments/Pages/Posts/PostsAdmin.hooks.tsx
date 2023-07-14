import { Article, EditNote, Lock, VisibilityOff } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import type { Post } from '@prisma/client';
import { PostStatus } from '@prisma/client';

import { Link } from 'components/Link';
import { getDomainFromPostType } from 'utils/functions';
import ZDate from 'utils/lib/date';

const STATUS_ICONS = {
  [PostStatus.DRAFT]: EditNote,
  [PostStatus.PROTECTED]: Lock,
  [PostStatus.PRIVATE]: VisibilityOff,
  [PostStatus.PUBLISHED]: Article,
};

/**
 * A hook for retrieving the posts table fields and value renderer.
 * @returns The table fields.
 */
export function usePostsTableFields(): TableField<Post>[] {
  return [
    {
      title: <Typography variant={'h6'}>#</Typography>,
      property: null,
      renderValue: (_, i) => <Typography variant={'body1'}>{i}</Typography>,
    },
    {
      title: <Typography variant={'h6'}>Title</Typography>,
      property: 'title',
      align: 'left',
      renderValue: (p) => {
        const domain = getDomainFromPostType(p);
        return (
          <Link
            href={`/${domain}/${p.slug}`}
            variant={'body1'}
            color={'inherit'}
            fontWeight={400}
            underline={'hover'}>
            {p.title}
          </Link>
        );
      },
    },
    {
      title: <Typography variant={'h6'}>Type</Typography>,
      property: 'type',
      align: 'left',
      renderValue: (p) => (
        <Typography variant={'body1'} fontWeight={700}>
          {p.type}
        </Typography>
      ),
    },
    {
      title: <Typography variant={'h6'}>Date Published</Typography>,
      property: 'datePublished',
      align: 'left',
      renderValue: (e) => (
        <Typography variant={'body1'}>
          {ZDate.format(e.datePublished)}
        </Typography>
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
