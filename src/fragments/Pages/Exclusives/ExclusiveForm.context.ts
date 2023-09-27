import type { Prisma } from '@prisma/client';
import { ExclusiveStatus } from '@prisma/client';
import React from 'react';

export const InitialExclusiveFormState: ExclusiveFormState = {
  exclusive: {
    content: '',
    subject: '',
    preview: '',
    endearment: '',
    date: new Date(),
    status: ExclusiveStatus.DRAFT,
    slug: '',
  },
};

export const ExclusiveFormContext = React.createContext<
  ReactUseState<ExclusiveFormState>
>([InitialExclusiveFormState, () => {}]);

interface ExclusiveFormState {
  exclusive: Prisma.ExclusiveCreateInput;
}
