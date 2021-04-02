import React, { useState } from 'react';

import { ConfirmButton } from 'src/components/button';
import { SearchBar } from 'src/components/form';
import css from 'src/styles/pages/Home.module.scss';

import { HomeRow } from '..';

export default () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <HomeRow className={css['home-search-row']}>
      <div className={css['home-search-container']}>
        <SearchBar
          value={searchTerm}
          placeholder={'Search this entire blog...'}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              launchSearch(searchTerm);
            }
          }}
          className={css['home-search-bar']}
          onClearInput={() => setSearchTerm('')}
        />
        <div className={css['home-search-button-container']}>
          <ConfirmButton
            className={css['home-search-button']}
            onClick={() => launchSearch(searchTerm)}>
            Search
          </ConfirmButton>
        </div>
      </div>
    </HomeRow>
  );
};

const launchSearch = (searchTerm: string) => {
  location.href = `/search?term=${searchTerm}`;
};
