import ContentSingle from 'fragments/Shared/ContentSingle';
import PagePlaceholder from 'fragments/Shared/Placeholders/PagePlaceholder';
import { trpc } from 'utils/trpc';

export default function Reverie({ params }: ReveriePageProps) {
  const { data: reverie } = trpc.post.find.useQuery(params);

  if (!reverie) return <PagePlaceholder />;

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Reveries' },
    { label: reverie.title },
  ];
  const pageCuratorInfo: PageCuratorInfo = {
    title: reverie.title,
    date: reverie.datePublished,
    entity: 'reverie',
  };
  return (
    <ContentSingle
      breadcrumbLinks={links}
      contentDate={reverie.datePublished}
      contentTitle={reverie.title}
      content={reverie.content}
      curatorInfo={pageCuratorInfo}
      editHref={`/admin/posts/edit/${reverie.id}`}
      image={reverie.image}
    />
  );
}

export interface ReveriePageProps extends AppPageProps {
  params: PostFindInput;
  slug: string;
}
