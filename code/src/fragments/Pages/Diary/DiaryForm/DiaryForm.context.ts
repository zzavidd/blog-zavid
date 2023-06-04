import type { Prisma } from '@prisma/client';
import { DiaryStatus } from '@prisma/client';
import React from 'react';

export const InitialDiaryFormState: DiaryFormState = {
  entry: {
    title: '',
    date: undefined,
    status: DiaryStatus.DRAFT,
    entryNumber: 0,
    content: '',
    footnote: '',
    tags: [],
  },
  tagsInput: '',
};

export const DiaryFormContext = React.createContext<
  ReactUseState<DiaryFormState>
>([InitialDiaryFormState, () => {}]);

interface DiaryFormState {
  entry: Prisma.DiaryCreateInput;
  tagsInput: string;
}
