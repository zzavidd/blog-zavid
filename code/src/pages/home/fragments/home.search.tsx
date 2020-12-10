import React, { useEffect, useState } from 'react';

import { SearchBar } from 'src/components/form';
import { Fader } from 'src/components/transitioner';
import css from 'src/styles/pages/Home.module.scss';

import { HomeRow } from '..';

export default () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [isLoaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, [isLoaded]);

  return (
    <Fader determinant={isLoaded} duration={800} delay={500} hollow={true}>
      <HomeRow className={css['search-row']}>
        <SearchBar
          value={searchTerm}
          placeholder={'Search blog...'}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              location.href = `/search?term=${searchTerm}`;
            }
          }}
          className={css['search-bar']}
          onClearInput={() => setSearchTerm('')}
        />
        {/* <ConfirmButton>Search</ConfirmButton> */}
      </HomeRow>
    </Fader>
  );
};
