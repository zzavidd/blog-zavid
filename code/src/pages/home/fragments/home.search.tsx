import React, { useState } from 'react';

import { ConfirmButton } from 'src/components/button';
import { SearchBar } from 'src/components/form';
import css from 'src/styles/pages/Home.module.scss';

import { HomeRow } from '..';

export default () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <HomeRow className={css['search-row']}>
      <SearchBar
        value={searchTerm}
        placeholder={'Search blog...'}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={css['search-bar']}
        onClearInput={() => setSearchTerm('')}
      />
      <ConfirmButton>Search</ConfirmButton>
    </HomeRow>
  );
};
