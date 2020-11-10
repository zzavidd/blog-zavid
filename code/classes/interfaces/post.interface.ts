import { GenericDAO } from "./super";

export interface PostDAO extends GenericDAO {
  title?: string;
  type?: PostType;
  typeId?: number;
  content?: string;
  status?: PostStatus;
  excerpt?: string;
  slug?: string;
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

export interface RandomPostOptions {
  allowPageTypes?: boolean;
  withImage?: boolean;
  numberOfContentImages?: number;
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  PRIVATE = 'PRIVATE',
  PUBLISHED = 'PUBLISHED'
}

export enum PostType {
  REVERIE = 'Reverie',
  EPISTLE = 'Epistle',
  POEM = 'Poem',
  MUSING = 'Musing',
  PAGE = 'Page'
}
