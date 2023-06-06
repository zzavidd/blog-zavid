import type { Prisma } from '@prisma/client';
import React from 'react';

export const InitialPageFormState: PageFormState = {
  page: {
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    isEmbed: false,
  },
};

export const PageFormContext = React.createContext<
  ReactUseState<PageFormState>
>([InitialPageFormState, () => {}]);

interface PageFormState {
  page: Prisma.PageCreateInput;
}
