import type { Dispatch, SetStateAction } from 'react';

declare global {
  interface AppPageProps {
    pathDefinition: PathDefinition;
    pageProps?: Record<string, unknown>;
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

  interface Substitutions {
    [key: string]: string | number;
  }

  interface EditButtonProps {
    id: number;
  }

  type ReactUseState<T> = [T, Dispatch<SetStateAction<T>>];
}
