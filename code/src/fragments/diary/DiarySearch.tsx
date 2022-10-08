import React from 'react';

export default function DiarySearch({ url, onlyFavs }: DiarySearchProps) {
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Searches diary entries using entered search term.
   * @param e The input DOM element.
   */
  const searchDiaryEntries = (
    e?: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const term = e?.target.value || '';
    setSearchTerm(term);
  };

  /** Clear the search input. */
  const clearInput = () => {
    setSearchTerm('');
    searchDiaryEntries();
  };

  return (
    <React.Fragment>
      <div>
        <SearchBar
          value={searchTerm}
          placeholder={'Search diary entries...'}
          onChange={searchDiaryEntries}
          onClearInput={clearInput}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              launchSearch(searchTerm);
            }
          }}
          withRightSpace={false}
        />
        <ConfirmButton onClick={() => launchSearch(searchTerm)}>
          Search
        </ConfirmButton>
      </div>
      <div>
        <Checkbox
          label={'Only favourites'}
          checked={onlyFavs}
          onChange={(e) => {
            const isChecked = e.target.checked;
            url.searchParams.set(
              PARAM_ONLY_FAVOURITES,
              JSON.stringify(isChecked),
            );
            location.href = url.toString();
          }}
        />
      </div>
    </React.Fragment>
  );
}

interface DiarySearchProps {
  url: URL;
  onlyFavs: boolean;
}
