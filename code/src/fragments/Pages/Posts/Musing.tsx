import ContentSingle from 'fragments/Shared/ContentSingle';
import PagePlaceholder from 'fragments/Shared/Placeholders/PagePlaceholder';
import { trpc } from 'utils/trpc';

export default function Musing({ params }: MusingPageProps) {
  const { data: musing } = trpc.post.find.useQuery(params);

  if (!musing) return <PagePlaceholder />;

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Musings' },
    { label: musing.title },
  ];
  const pageCuratorInfo: PageCuratorInfo = {
    title: `Musing ${musing.typeId}: ${musing.title}`,
    date: musing.datePublished,
  };
  return (
    <ContentSingle
      breadcrumbLinks={links}
      contentDate={musing.datePublished}
      contentTitle={musing.title}
      content={musing.content}
      curatorInfo={pageCuratorInfo}
      editHref={`/admin/posts/edit/${musing.id}`}
    />
  );
}

export interface MusingPageProps extends AppPageProps {
  params: PostFindInput;
  slug: string;
}
