import type { TableCellProps } from '@mui/material';
import type { Diary, DiaryCategory } from '@prisma/client';
import type { Dispatch, SetStateAction } from 'react';
import type { z } from 'zod';

import type { RouterInput } from 'server/routers/_app.router';
import type { zFindOptions } from 'utils/validators';

declare global {
  interface AppPageProps {
    pathDefinition: PathDefinition;
    pageProps?: Record<string, unknown>;
  }

  type FindOptions = z.infer<typeof zFindOptions>;
  type PostFindInput = RouterInput['post']['find'];

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
    categories: DiaryCategory[];
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
