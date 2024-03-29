import type {
  PaletteMode,
  PaletteOptions,
  SelectChangeEvent,
  TableCellProps,
} from '@mui/material';
import type {
  Diary,
  DiaryCategory,
  Prisma,
  WishlistCategory,
} from '@prisma/client';
import type { Dispatch, SetStateAction } from 'react';
import type { z } from 'zod';

import type { RouterInput } from 'server/routers/_app.router';
import type { SubscriptionType } from 'utils/enum';
import type {
  zEmailPreviewType,
  zFindOptions,
  zIndexInput,
  zNotifyOptions,
  zWishlistClaimPayload,
  zWishlistUnclaimPayload,
} from 'utils/validators';

declare global {
  interface AppPageProps {
    pathDefinition: PathDefinition;
    pageProps?: Record<string, unknown>;
    theme?: Record<PaletteMode, PaletteOptions>;
  }

  interface PostSingleProps extends AppPageProps {
    params: PostFindInput;
    previousParams: PostFindInput;
    nextParams: PostFindInput;
    indexParams: IndexInput;
    slug: string;
  }

  interface WishlistPageProps extends AppPageProps {
    categoryParams: WishlistCategoryFindManyInput;
  }

  type WishlistClaimPayload = z.infer<typeof zWishlistClaimPayload>;
  type WishlistUnclaimPayload = z.infer<typeof zWishlistUnclaimPayload>;

  interface WishlistCategoryWithCount extends WishlistCategory {
    _count: Prisma.WishlistCategoryCountOutputType;
  }

  interface WishlistReservees {
    [key: string]: {
      quantity: number;
      anonymous: boolean;
    };
  }

  type NotifyOptions = z.infer<typeof zNotifyOptions>;
  type EmailPreviewType = z.infer<typeof zEmailPreviewType>;
  type FindOptions = z.infer<typeof zFindOptions>;

  type DiaryFindInput = RouterInput['diary']['find'];
  type MoodFindManyInput = RouterInput['mood']['findMany'];
  type WishlistFindManyInput = RouterInput['wishlist']['findMany'];
  type WishlistCategoryFindManyInput =
    RouterInput['wishlistCategory']['findMany'];

  type ExclusiveFindInput = RouterInput['exclusive']['find'];
  type PageFindInput = RouterInput['page']['find'];
  type PostFindInput = RouterInput['post']['find'];

  type IndexInput = z.infer<typeof zIndexInput>;

  interface ContentNavigationProps {
    previous: NavInfo | null;
    next: NavInfo | null;
  }

  interface NavInfo {
    headline: string;
    subline: string;
    href: string;
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
    date: Date | null;
    categories?: DiaryCategory[];
    isFavourite?: boolean;
    entity: string;
  }

  interface TableField<T> {
    title: React.ReactNode;
    property: keyof T | null;
    align?: TableCellProps['align'];
    renderValue: (entry: T, index?: number) => React.ReactNode;
  }

  type ChangeEvent =
    | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    | SelectChangeEvent;
  type DiaryWithCategories = Diary & { categories: DiaryCategory[] };
  type DateOp = keyof Pick<Prisma.DateTimeNullableFilter, 'gt' | 'lt'>;
  type ReactUseState<T> = [T, Dispatch<SetStateAction<T>>];
  type SubscriptionMap = Record<SubscriptionType, boolean>;
}
