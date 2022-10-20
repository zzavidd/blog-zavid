import type { EntityDAO } from '../entity';

export interface PageDAO extends EntityDAO {
  title: string;
  content: string;
  isEmbed: boolean;
  excerpt: string;
  slug?: string;
  lastModified?: string | Date;
}
