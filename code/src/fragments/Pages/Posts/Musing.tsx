import { Typography } from '@mui/material';
import type { Post } from '@prisma/client';

import type {
  ContentNavigationProps,
  NavInfo,
} from 'fragments/Shared/ContentSingle';
import ContentSingle, {
  ContentNavigation,
} from 'fragments/Shared/ContentSingle';
import PagePlaceholder from 'fragments/Shared/Placeholders/PagePlaceholder';
import { trpc } from 'utils/trpc';

export default function Musing({
  params,
  previousParams,
  nextParams,
  indexParams,
}: MusingPageProps) {
  const { data: musing } = trpc.post.find.useQuery(params);
  const { data: previous } = trpc.post.find.useQuery(previousParams);
  const { data: next } = trpc.post.find.useQuery(nextParams);
  const { data: index = 0 } = trpc.post.index.useQuery(indexParams);

  if (!musing) return <PagePlaceholder />;

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Musings' },
    { label: `#${index}: ${musing.title}` },
  ];
  const pageCuratorInfo: PageCuratorInfo = {
    title: `Musing #${index}: ${musing.title}`,
    date: musing.datePublished,
  };

  const NavigationProps: ContentNavigationProps = {
    previous: createNavigationInfo(previous, index - 1),
    next: createNavigationInfo(next, index + 1),
  };

  return (
    <ContentSingle
      breadcrumbLinks={links}
      contentDate={musing.datePublished}
      contentTitle={musing.title}
      content={musing.content}
      curatorInfo={pageCuratorInfo}
      editHref={`/admin/posts/edit/${musing.id}`}
      NavigationProps={NavigationProps}
      ContentExtras={<ContentNavigation {...NavigationProps} />}
      TitleExtras={
        <Typography
          fontSize={13}
          fontWeight={900}
          textAlign={'center'}
          lineHeight={0.5}
          order={-1}>
          Musing #{index}:
        </Typography>
      }
    />
  );
}

function createNavigationInfo(
  post: Post | null | undefined,
  index: number,
): NavInfo | null {
  return post
    ? {
        headline: `Musing #${index}`,
        subline: post.title,
        href: `/musings/${post.slug}`,
      }
    : null;
}

export interface MusingPageProps extends AppPageProps {
  params: PostFindInput;
  previousParams: PostFindInput;
  nextParams: PostFindInput;
  indexParams: IndexInput;
  slug: string;
}
