import type { PostType } from './posts/PostDAO';

export interface EntityDAO {
  id?: number;
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
  confirmButtonText: string;
  cancelFunction?: () => void;
  isRequestPending: boolean;
}
