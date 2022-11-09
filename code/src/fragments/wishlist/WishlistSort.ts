import type WishlistDAO from 'classes/wishlist/WishlistDAO';

export const SORT_OPTIONS: SortOption[] = [
  { label: 'Sort By Date Added', value: 'createTime' },
  { label: 'Sort By Price', value: 'price' },
  { label: 'Sort By Priority', value: 'priority' },
  { label: 'Sort By Quantity', value: 'quantity' },
  { label: 'Sort By Title', value: 'name' },
];

export const SORT_BY: SortBy = {
  name: {
    asc: (a, b) =>
      a.name.localeCompare(b.name, 'en', { ignorePunctuation: true }),
    desc: (a, b) =>
      b.name.localeCompare(a.name, 'en', { ignorePunctuation: true }),
  },
  price: numberSort('price'),
  priority: numberSort('priority'),
  quantity: numberSort('quantity'),
  createTime: {
    asc: (a, b) =>
      new Date(a.createTime!).getTime() - new Date(b.createTime!).getTime(),
    desc: (a, b) =>
      new Date(b.createTime!).getTime() - new Date(a.createTime!).getTime(),
  },
};

function numberSort(prop: KeysMatching<WishlistDAO, number>): SortFunctionPair {
  return {
    asc: (a, b) => {
      if (a.purchaseDate && b.purchaseDate) {
        return a[prop] - b[prop];
      } else if (a.purchaseDate) {
        return 1;
      } else if (b.purchaseDate) {
        return -1;
      } else {
        return a[prop] - b[prop];
      }
    },
    desc: (a, b) => {
      if (a.purchaseDate && b.purchaseDate) {
        return b[prop] - a[prop];
      } else if (a.purchaseDate) {
        return 1;
      } else if (b.purchaseDate) {
        return -1;
      } else {
        return b[prop] - a[prop];
      }
    },
  };
}

interface SortFunctionPair {
  asc: SortFunction;
  desc: SortFunction;
}
type SortFunction = (a: WishlistDAO, b: WishlistDAO) => number;
type KeysMatching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

type SortBy = Record<SortProperty, SortFunctionPair>;

interface SortOption {
  readonly label: string;
  readonly value: SortProperty;
}
