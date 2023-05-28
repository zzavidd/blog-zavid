import type { Diary, Prisma } from '@prisma/client';
import React from 'react';

export const InitialDiaryAdminState: DiaryAdminState = {
  isDeleteModalVisible: false,
  isMenuVisible: false,
  menuAnchor: null,
  selectedDiaryEntry: null,
  sort: {
    property: 'entryNumber',
    order: 'desc',
  },
};

export const DiaryAdminContext = React.createContext<
  ReactUseState<DiaryAdminState>
>([InitialDiaryAdminState, () => {}]);

interface DiaryAdminState {
  isDeleteModalVisible: boolean;
  isMenuVisible: boolean;
  menuAnchor: HTMLButtonElement | null;
  selectedDiaryEntry: Diary | null;
  sort: {
    property: keyof Diary;
    order: Prisma.SortOrder;
  };
}
