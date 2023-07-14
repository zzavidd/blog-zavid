import type { Prisma } from '@prisma/client';
import { PostStatus, PostType } from '@prisma/client';
import React from 'react';

export const InitialPostFormState: PostFormState = {
  post: {
    title: '',
    datePublished: undefined,
    status: PostStatus.DRAFT,
    type: PostType.PASSAGE,
    content: '',
    excerpt: '',
    slug: '',
    typeId: 0,
    domainId: 0,
  },
};

export const PostFormContext = React.createContext<
  ReactUseState<PostFormState>
>([InitialPostFormState, () => {}]);

interface PostFormState {
  post: Prisma.PostCreateInput;
}
