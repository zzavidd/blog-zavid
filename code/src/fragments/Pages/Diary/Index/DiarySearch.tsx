import { Close, Search } from '@mui/icons-material';
import { Button, InputAdornment, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

export default function DiarySearch() {
  const [state, setState] = useState({ searchTerm: '' });

  const router = useRouter();

  function onTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    setState((s) => ({ ...s, searchTerm: e.target.value }));
  }

  function clearSearch() {
    setState((s) => ({ ...s, searchTerm: '' }));
  }

  function searchDiary() {
    const { searchTerm } = state;
    void router.push(searchTerm ? `/diary?search=${searchTerm}` : '/diary');
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      searchDiary();
    }
  }

  return (
    <TextField
      value={state.searchTerm}
      onChange={onTextChange}
      placeholder={'Search the diary...'}
      onKeyDown={onKeyDown}
      sx={{
        maxWidth: (t) => t.spacing(13),
        p: 1,
        width: '100%',
      }}
      InputProps={{
        style: { fontSize: 16 },
        startAdornment: (
          <InputAdornment position={'start'}>
            <Search color={'disabled'} />
          </InputAdornment>
        ),
        endAdornment: (
          <React.Fragment>
            <InputAdornment position={'end'}>
              {state.searchTerm ? (
                <Close onClick={clearSearch} color={'primary'} />
              ) : null}
            </InputAdornment>
            <Button
              onClick={searchDiary}
              sx={{
                fontSize: { xs: 11, md: 14 },
                minWidth: { xs: 0, md: 'auto' },
              }}>
              Search
            </Button>
          </React.Fragment>
        ),
      }}
    />
  );
}
