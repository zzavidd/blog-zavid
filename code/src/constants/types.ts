import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';

import type { PostType, PostStatus } from 'classes/posts/PostDAO';

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export interface AppPageProps {
  pathDefinition: PathDefinition;
  pageProps?: Record<string, unknown>;
}

export interface PostFiltersOptions {
  limit?: number;
  field?: string;
  order?: string;
  type?: PostType | null;
  status?: PostStatus;
}

export interface PathDefinition {
  title: string;
  description?: string;
  url?: string;
  cardImage?: string;
  article?: {
    publishedTime: string;
    tags: string[];
  };
}

export enum QueryOrder {
  ASCENDING = 'ASC',
  DESCENDING = 'DESC',
  RANDOM = 'RANDOM',
}

export interface AlertDefinition {
  message: string;
  type: 'success' | 'error';
}
export type AlertType = 'success' | 'error';

export interface SnackDefinition {
  message: string;
  duration?: number | 'indefinite';
}

export interface Substitutions {
  [key: string]: string | number;
}

export interface EditButtonProps {
  id: number;
}

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};
export type ReactHook<T> = React.Dispatch<React.SetStateAction<T>>;
export type LocalDispatch<T> = (state: Partial<T>) => void;
