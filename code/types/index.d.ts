import type { Diary, DiaryCategory } from '@prisma/client';
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

  interface PageCuratorInfo {
    title: string;
    date: Date;
    categories: string[];
  }

  interface TableField<T> {
    title: React.ReactNode;
    property: keyof T | null;
    align?: TableCellProps['align'];
    renderValue: (entry: T, index?: number) => React.ReactNode;
  }

  type DiaryWithCategories = Diary & {
    categories: DiaryCategory[];
  };

  type ReactUseState<T> = [T, Dispatch<SetStateAction<T>>];
}
