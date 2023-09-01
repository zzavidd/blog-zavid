import React from 'react';

import type { DiaryIndexProps } from './DiaryIndex';

export const DiaryIndexContext = React.createContext<DiaryIndexProps>({
  params: {},
  searchTerm: '',
});
