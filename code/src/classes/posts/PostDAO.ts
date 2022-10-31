export interface PostDAO {
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

export interface PostImage {
  source: string;
  hasChanged: boolean;
  isCover?: boolean;
}

export interface PostContentImageMapping {
  [key: string]: PostImage;
}

export interface RandomPostOptions {
  allowPageTypes?: boolean;
  numberOfContentImages?: number;
  withImage?: boolean;
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  PROTECTED = 'PROTECTED',
  PRIVATE = 'PRIVATE',
  PUBLISHED = 'PUBLISHED',
}

export enum PostType {
  REVERIE = 'Reverie',
  EPISTLE = 'Epistle',
  POEM = 'Poem',
  MUSING = 'Musing',
  PAGE = 'Page',
}

export type PostContentImages =
  | PostImage[]
  | string[]
  | PostContentImageMapping
  | string
  | undefined;

export interface PostDomain extends Pick<PostDAO, 'type' | 'status'> {
  label: string | number;
  value: string | number;
}
