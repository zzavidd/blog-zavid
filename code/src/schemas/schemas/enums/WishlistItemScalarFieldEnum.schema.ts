import { z } from 'zod';

export const WishlistItemScalarFieldEnumSchema = z.enum([
  'id',
  'name',
  'price',
  'comments',
  'quantity',
  'categoryId',
  'visibility',
  'priority',
  'image',
  'href',
  'reservees',
  'purchaseDate',
  'createTime',
]);
