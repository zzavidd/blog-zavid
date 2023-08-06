import ContentSingle from 'fragments/Shared/ContentSingle';
import PagePlaceholder from 'fragments/Shared/Placeholders/PagePlaceholder';
import { trpc } from 'utils/trpc';

export default function Passage({ params }: PassagePageProps) {
  const { data: passage } = trpc.post.find.useQuery(params);

  if (!passage) return <PagePlaceholder />;

  const links = [{ label: 'Home', href: '/' }, { label: passage.title }];
  const pageCuratorInfo: PageCuratorInfo = {
    title: passage.title,
    date: passage.datePublished,
    entity: 'passage',
  };
  return (
    <ContentSingle
      breadcrumbLinks={links}
      contentDate={passage.datePublished}
      contentTitle={passage.title}
      content={passage.content}
      curatorInfo={pageCuratorInfo}
      editHref={`/admin/posts/edit/${passage.id}`}
    />
  );
}

export interface PassagePageProps extends AppPageProps {
  params: PostFindInput;
  slug: string;
}
