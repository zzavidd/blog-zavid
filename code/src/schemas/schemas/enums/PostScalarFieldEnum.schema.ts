import { z } from 'zod';

export const PostScalarFieldEnumSchema = z.enum([
  'id',
  'title',
  'datePublished',
  'content',
  'image',
  'contentImages',
  'status',
  'slug',
  'excerpt',
  'type',
  'typeId',
  'createTime',
  'domainId',
]);
