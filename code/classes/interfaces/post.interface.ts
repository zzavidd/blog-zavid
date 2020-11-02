export interface PostDAO {
  id?: number
  title?: string;
  type?: PostType;
  typeId?: number;
  content?: string;
  status?: PostStatus;
  excerpt?: string;
  slug?: string
  datePublished?: string | Date;
  image?: PostImage | string;
  contentImages?: PostImage[] | string[] | string;
  domainId?: number;
}

export interface PostImage {
  source: string;
  hasChanged: boolean;
  isCover?: boolean;
}

export interface PostImageOptions {
  withImage?: boolean;
  numberOfContentImages?: number;
}

export enum PostStatus {
  DRAFT,
  PRIVATE,
  PUBLISHED
}

export enum PostType {
  REVERIE = 'Reverie',
  EPISTLE = 'Epistle',
  POEM = 'Poem',
  MUSING = 'Musing',
  PAGE = 'Page'
}