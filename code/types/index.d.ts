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

  interface SubscriptionMapping {
    Diary: boolean;
    Reverie: boolean;
  }

  interface TableField<T> {
    title: React.ReactNode;
    property: keyof T;
    align?: TableCellProps['align'];
    renderValue: (entry: T, index?: number) => React.ReactNode;
  }

  type ReactUseState<T> = [T, Dispatch<SetStateAction<T>>];
}
