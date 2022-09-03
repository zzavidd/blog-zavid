export interface AppPageProps {
  pathDefinition: PathDefinition;
  pageProps?: Record<string, unknown>;
}

export interface PathDefinition {
  title: string;
  description?: string;
  url?: string;
  cardImage?: string;
}

export enum QueryOrder {
  ASCENDING = 'ASC',
  DESCENDING = 'DESC',
  RANDOM = 'RANDOM',
}

export type ReactHook<T> = React.Dispatch<React.SetStateAction<T>>;

export type OnInputChangeType = (
  event: React.ChangeEvent<HTMLInputElement>,
) => void;

export interface Substitutions {
  [key: string]: string | number;
}

export interface EditButtonProps {
  id: number;
}
