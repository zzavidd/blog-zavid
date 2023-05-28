import type { Diary, Prisma } from '@prisma/client';
import React from 'react';

export const InitialDiaryAdminState: DiaryAdminState = {
  selectedDiaryEntry: null,
  deleteModalVisible: false,
  sort: {
    property: 'entryNumber',
    order: 'desc',
  },
};

export const DiaryAdminContext = React.createContext<
  ReactUseState<DiaryAdminState>
>([InitialDiaryAdminState, () => {}]);

interface DiaryAdminState {
  selectedDiaryEntry: Diary | null;
  deleteModalVisible: boolean;
  sort: {
    property: keyof Diary;
    order: Prisma.SortOrder;
  };
}
