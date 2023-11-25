import { PostType } from '@prisma/client';
import { z } from 'zod';

import { WishlistItemSchema } from 'schemas';

export const zWishlistClaimPayload = z.object({
  id: z.number(),
  email: z.string().email({ message: 'Provide a valid email address.' }),
  quantity: z.number().min(1),
  anonymous: z.boolean(),
});

export const zWishlistUnclaimPayload = z.object({
  id: z.number(),
  email: z.string().email(),
});

export const zWishlistForm = WishlistItemSchema.omit({ id: true }).extend({
  name: z.string().nonempty(),
  price: z.coerce.number(),
});

export const zSubscribeForm = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
});

export const zFindOptions = z
  .object({
    contentWordLimit: z.number().optional(),
    searchTerm: z.string().optional(),
  })
  .optional();

export const zEmailPreviewType = z.enum(['Ethereal', 'Gmail']).optional();

export const zNotifyOptions = z.object({
  isPreview: z.boolean().optional(),
  previewType: zEmailPreviewType,
  directRecipients: z.string().array().optional(),
  subscribedRecipients: z.number().array().optional(),
});

export const zIndexInput = z.object({
  id: z.number(),
  type: z.nativeEnum(PostType),
});
