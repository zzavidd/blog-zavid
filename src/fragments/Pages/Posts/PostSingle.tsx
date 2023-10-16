import { Typography, capitalize } from '@mui/material';

import ContentSingle, {
  ContentNavigation,
} from 'fragments/Shared/ContentSingle';
import PagePlaceholder from 'fragments/Shared/Placeholders/PagePlaceholder';
import { DOMAINS, createPostNavigationInfo } from 'utils/functions';
import { trpc } from 'utils/trpc';

export default function PostSingle({
  params,
  previousParams,
  nextParams,
  indexParams,
}: PostSingleProps) {
  const { data: post } = trpc.post.find.useQuery(params);
  const { data: previous } = trpc.post.find.useQuery(previousParams);
  const { data: next } = trpc.post.find.useQuery(nextParams);
  const { data: index = 0 } = trpc.post.index.useQuery(indexParams);

  if (!post) return <PagePlaceholder />;

  const domain = DOMAINS[post.type];

  const links = [
    { label: 'Home', href: '/' },
    { label: capitalize(domain.collection) },
    { label: post.title },
  ];
  const pageCuratorInfo: PageCuratorInfo = {
    title: post.title,
    date: post.datePublished,
    entity: domain.singular,
  };

  const NavigationProps: ContentNavigationProps = {
    previous: createPostNavigationInfo(previous, index - 1),
    next: createPostNavigationInfo(next, index + 1),
  };

  return (
    <ContentSingle
      breadcrumbLinks={links}
      contentDate={post.datePublished}
      contentTitle={post.title}
      content={post.content}
      curatorInfo={pageCuratorInfo}
      editHref={`/admin/posts/edit/${post.id}`}
      image={post.image}
      NavigationProps={NavigationProps}
      ContentExtras={<ContentNavigation {...NavigationProps} />}
      TitleExtras={
        <Typography
          fontSize={13}
          fontWeight={900}
          textAlign={{ xs: 'left', md: 'center' }}
          lineHeight={0.5}
          order={-1}>
          {capitalize(domain.singular)} #{index}:
        </Typography>
      }
    />
  );
}
