export interface PageDAO {
  id?: number;
  title: string;
  content: string;
  isEmbed: boolean;
  excerpt: string;
  slug?: string;
  lastModified?: string | Date;
}
