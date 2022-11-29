interface PostDAO {
  id?: number;
  title: string;
  type: PostType;
  typeId?: number;
  content: string;
  status?: PostStatus;
  excerpt: string;
  slug: string | null;
  tags: string | string[];
  datePublished: string | Date;
  image: PostImage | string | null;
  imagePlaceholder?: string;
  contentImages: PostContentImages;
  domainId?: number;
  domainTitle?: string;
  domainType?: PostType;
  domainSlug?: string;
}

interface PostImage {
  source: string;
  hasChanged: boolean;
  isCover?: boolean;
}

interface PostContentImageMapping {
  [key: string]: PostImage;
}

interface RandomPostOptions {
  allowPageTypes?: boolean;
  numberOfContentImages?: number;
  withImage?: boolean;
}

type PostType = 'Reverie' | 'Epistle' | 'Poem' | 'Musing' | 'Page';
type PostStatus = 'DRAFT' | 'PROTECTED' | 'PRIVATE' | 'PUBLISHED';

type PostContentImages =
  | PostImage[]
  | string[]
  | PostContentImageMapping
  | string
  | undefined;

interface PostDomain extends Pick<PostDAO, 'type' | 'status'> {
  label: string | number;
  value: string | number;
}
