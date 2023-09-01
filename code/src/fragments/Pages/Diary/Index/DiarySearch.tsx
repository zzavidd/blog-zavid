import { Close, Search } from '@mui/icons-material';
import type { Theme } from '@mui/material';
import {
  Button,
  InputAdornment,
  TextField,
  useMediaQuery,
} from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

export default function DiarySearch() {
  const [state, setState] = useState({ searchTerm: '' });
  const isDesktopAbove = useMediaQuery<Theme>((t) => t.breakpoints.up('lg'));

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
        maxWidth: (t) => t.spacing(isDesktopAbove ? 13 : 12),
        width: '100%',
      }}
      InputProps={{
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
            <Button onClick={searchDiary}>Search</Button>
          </React.Fragment>
        ),
      }}
    />
  );
}
