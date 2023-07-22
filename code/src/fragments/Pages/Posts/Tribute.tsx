import type { Post } from '@prisma/client';

import ContentSingle from 'fragments/Shared/ContentSingle';
import PagePlaceholder from 'fragments/Shared/Placeholders/PagePlaceholder';
import { getDomainFromPostType } from 'utils/functions';
import { trpc } from 'utils/trpc';

export default function Tribute({ params, domain }: TributePageProps) {
  const { data: tribute } = trpc.post.find.useQuery(params);

  if (!tribute) return <PagePlaceholder />;

  const links = [
    { label: 'Home', href: '/' },
    domain
      ? {
          label: domain.title,
          href: `/${getDomainFromPostType(domain)}/${domain.slug}`,
        }
      : null,
    { label: tribute.title },
  ];
  const pageCuratorInfo: PageCuratorInfo = {
    title: tribute.title,
    date: tribute.datePublished,
  };
  return (
    <ContentSingle
      breadcrumbLinks={links}
      contentDate={tribute.datePublished}
      contentTitle={tribute.title}
      content={tribute.content}
      curatorInfo={pageCuratorInfo}
      editHref={`/admin/posts/edit/${tribute.id}`}
    />
  );
}

export interface TributePageProps extends AppPageProps {
  params: PostFindInput;
  domain: Post | null;
  slug: string;
}
