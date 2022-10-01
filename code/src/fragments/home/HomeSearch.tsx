import React, { useState } from 'react';

import { ConfirmButton } from 'components/button';
import { SearchBar } from 'components/form';
import css from 'styles/pages/Home.module.scss';
import * as Styles from 'stylesv2/Pages/Home.styles';

export default function HomeSearch() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Styles.HomeRow>
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
    </Styles.HomeRow>
  );
}

const launchSearch = (searchTerm: string) => {
  location.href = `/search?term=${searchTerm}`;
};
