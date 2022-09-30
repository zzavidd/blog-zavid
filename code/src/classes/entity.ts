import type { PostType } from './posts/PostDAO';

export interface EntityDAO extends Record<string, unknown> {
  readonly id?: number;
}

export interface SearchResultEntityDAO {
  index?: number;
  title: string;
  type: PostType | 'Diary Entry';
  content: string;
  date: string | Date;
  slug: string;
  image?: string;
}

export interface EntityFormProps {
  confirmFunction?: () => void;
  cancelFunction?: () => void;
  confirmButtonText: string;
  isRequestPending: boolean;
}
