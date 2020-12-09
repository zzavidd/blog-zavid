import React, { useState } from 'react';

import { DiaryDAO, ReactHook, ReactInputChangeEvent } from 'classes';
import { SearchBar } from 'src/components/form';
import css from 'src/styles/pages/Diary.module.scss';

export default ({ diaryEntries, setFilteredEntries }: DiarySearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Searches diary entries using entered search term.
   * @param e The input DOM element.
   */
  const searchDiaryEntries = (e?: ReactInputChangeEvent): void => {
    const term = e?.target.value || '';
    setSearchTerm(term);
    filterEntriesBySearchTerm(term);
  };

  /**
   * Filters diary entries by a search term.
   * @param term The search term.
   */
  const filterEntriesBySearchTerm = (term: string): void => {
    if (!term || !term.length) {
      setFilteredEntries(diaryEntries);
      return;
    }

    const fields: Array<keyof DiaryDAO> = ['title', 'content'];
    term = term.toLowerCase();

    const filteredEntries = diaryEntries.filter((entry) => {
      const predicate = (field: keyof DiaryDAO) => {
        const value = entry[field] as string;
        return value.toLowerCase().includes(term);
      };
      return fields.some(predicate);
    });
    setFilteredEntries(filteredEntries);
  };

  const clearInput = () => {
    setSearchTerm('');
    searchDiaryEntries();
  };

  return (
    <div className={css['diary-search']}>
      <SearchBar
        value={searchTerm}
        placeholder={'Search diary entries...'}
        onChange={searchDiaryEntries}
        className={css['diary-search-bar']}
        onClearInput={clearInput}
      />
    </div>
  );
};

type DiarySearchProps = {
  diaryEntries: DiaryDAO[];
  setFilteredEntries: ReactHook<DiaryDAO[]>;
};
