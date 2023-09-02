import { Search } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { InputAdornment, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';

import { DiaryIndexContext } from './DiaryIndex.utils';

export default function DiarySearch() {
  const { searchTerm } = useContext(DiaryIndexContext);
  const [state, setState] = useState({
    searchTerm,
    isSearchLoading: false,
    isClearLoading: false,
  });
  const isLoading = state.isSearchLoading || state.isClearLoading;

  const router = useRouter();

  function onTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    setState((s) => ({ ...s, searchTerm: e.target.value }));
  }

  async function clearSearch() {
    setState((s) => ({ ...s, isClearLoading: true }));
    await router.push('/diary');
    setState((s) => ({ ...s, isClearLoading: false, searchTerm: '' }));
  }

  async function searchDiary() {
    setState((s) => ({ ...s, isSearchLoading: true }));
    const { searchTerm } = state;
    await router.push(searchTerm ? `/diary?search=${searchTerm}` : '/diary');
    setState((s) => ({ ...s, isSearchLoading: false }));
  }

  async function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      await searchDiary();
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
      FormHelperTextProps={{
        sx: { mt: 2, mx: 0 },
      }}
      helperText={
        searchTerm ? (
          <LoadingButton
            onClick={clearSearch}
            loading={state.isClearLoading}
            disabled={isLoading}
            sx={{ fontSize: 10, p: 0 }}>
            Clear search
          </LoadingButton>
        ) : null
      }
      InputProps={{
        style: { fontSize: 16 },
        startAdornment: (
          <InputAdornment position={'start'}>
            <Search color={'disabled'} />
          </InputAdornment>
        ),
        endAdornment: (
          <LoadingButton
            onClick={searchDiary}
            loading={state.isSearchLoading}
            disabled={isLoading}
            sx={{
              fontSize: { xs: 11, md: 14 },
              minWidth: { xs: 0, md: 'auto' },
            }}>
            Search
          </LoadingButton>
        ),
      }}
    />
  );
}
