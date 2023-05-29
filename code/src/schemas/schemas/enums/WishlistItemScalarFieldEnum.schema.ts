import { z } from 'zod';

export const WishlistItemScalarFieldEnumSchema = z.enum([
  'id',
  'name',
  'price',
  'quantity',
  'categoryId',
  'priority',
  'visibility',
  'image',
  'href',
  'comments',
  'reservees',
  'purchaseDate',
  'createTime',
]);
