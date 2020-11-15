import { GenericDAO } from "./super";

export interface PageDAO extends GenericDAO {
  title?: string;
  content?: string
  slug?: string;
  isEmbed?: boolean
  excerpt?: string
  lastModified?: string | Date
}