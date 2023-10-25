import { capitalize } from '@mui/material';
import {
  WishlistPriority,
  WishlistVisibility,
  type WishlistItem,
} from '@prisma/client';
import { useContext } from 'react';

import { WishlistContext } from '../WishlistContext';

export function useFilters(): FilterGroup[] {
  const [context] = useContext(WishlistContext);
  return [
    {
      group: 'Filter by Category',
      options: Object.entries(context.categories)
        .sort((a, b) => a[1].name.localeCompare(b[1].name))
        .map(([id, { name }]) => ({ label: name, value: Number(id) })),
      property: 'categoryId',
    },
    {
      group: 'Filter by Priority',
      options: Object.entries(WishlistPriority).map(([id, name]) => ({
        label: name,
        value: id,
      })),
      property: 'priority',
    },
    {
      group: 'Filter by Visibility',
      options: Object.values(WishlistVisibility).map((name) => ({
        label: capitalize(name),
        value: name,
      })),
      property: 'visibility',
      adminOnly: true,
    },
  ];
}

interface FilterGroup {
  group: string;
  property: keyof WishlistItem;
  options: { label: string; value: string | number }[];
  adminOnly?: boolean;
}
