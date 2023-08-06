import { PostType } from '@prisma/client';
import { z } from 'zod';

export const zSubscribeForm = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
});

export const zSubscriberAnnouncement = z.object({
  content: z
    .string()
    .nonempty({ message: 'Please enter the announcement content.' }),
  subject: z
    .string()
    .nonempty({ message: 'Please enter the announcement subject.' }),
  preview: z
    .string()
    .nonempty({ message: 'Please enter the announcement preview.' }),
  endearment: z.string(),
});

export const zFindOptions = z
  .object({ contentWordLimit: z.number().optional() })
  .optional();

export const zEmailPreviewType = z.enum(['Ethereal', 'Gmail']).optional();

export const zNotifyOptions = z.object({
  isPreview: z.boolean().optional(),
  previewType: zEmailPreviewType,
});

export const zIndexInput = z.object({
  id: z.number(),
  type: z.nativeEnum(PostType),
});
