import type { EntityDAO } from '../entity';

export interface PageDAO extends EntityDAO {
  title?: string;
  content?: string;
  slug?: string;
  isEmbed?: boolean;
  excerpt?: string;
  lastModified?: string | Date;
}
