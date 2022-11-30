interface EntityDAO {
  id?: number;
}

type SortProperty = 'createTime' | 'name' | 'price' | 'priority' | 'quantity';

interface SearchResultEntityDAO {
  index?: number;
  title: string;
  type: PostType | 'Diary Entry';
  content: string;
  date: string | Date;
  slug: string;
  image?: string;
}

interface EntityFormProps {
  onSubmit?: () => void;
  onCancel?: () => void;
  onSubmitText: string;
}

interface AppPageProps {
  pathDefinition: PathDefinition;
  pageProps?: Record<string, unknown>;
}

interface PostFiltersOptions {
  limit?: number;
  field?: string;
  order?: string;
  type?: PostType | null;
  status?: PostStatus;
}

interface PathDefinition {
  title: string;
  description?: string;
  url?: string;
  cardImage?: string;
  article?: {
    publishedTime: string;
    tags: string[];
  };
}

interface AlertDefinition {
  message: string;
  type: 'success' | 'error';
}
type AlertType = 'success' | 'error';

interface SnackDefinition {
  message: string;
  duration?: number | 'indefinite';
}

interface Substitutions {
  [key: string]: string | number;
}

interface EditButtonProps {
  id: number;
}

type ReactHook<T> = React.Dispatch<React.SetStateAction<T>>;
type LocalDispatch<T> = (state: Partial<T>) => void;
