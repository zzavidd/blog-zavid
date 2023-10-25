import { PostType } from '@prisma/client';
import { z } from 'zod';

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
  recipients: z.number().array().optional(),
});

export const zIndexInput = z.object({
  id: z.number(),
  type: z.nativeEnum(PostType),
});
