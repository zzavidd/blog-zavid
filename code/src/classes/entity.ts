import type { PostType } from './posts/PostDAO';

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
  onSubmit?: () => void;
  onCancel?: () => void;
  onSubmitText: string;
}
