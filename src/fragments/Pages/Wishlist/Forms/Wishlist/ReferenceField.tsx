import QrCodeIcon from '@mui/icons-material/QrCode';
import {
  Card,
  CardContent,
  CardMedia,
  FormControl,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ImmutabilityHelper from 'immutability-helper';
import React from 'react';
import type { Fetcher } from 'swr';
import useSWR from 'swr';

import { WishlistPageContext } from 'utils/contexts';

const ERROR_TEXT = 'Failed to fetch preview. Is the URL valid?';

const fetcher: Fetcher<string, string> = async (url) => {
  const res = await fetch(url);
  return res.text();
};

export default function ReferenceField() {
  const [context, setContext] = React.useContext(WishlistPageContext);
  const { wishlistItemRequest } = context;

  const [state, setState] = React.useState<ReferenceFieldState>({
    href: undefined,
    metadata: null,
    shouldFetch: false,
    showHelperText: false,
  });

  const swrKey = state.shouldFetch ? state.href : null;
  const { data, error, isLoading } = useSWR(swrKey, fetcher, {
    onSuccess: (data) => {
      setState((current) => ({
        ...current,
        shouldFetch: false,
      }));
    },
  });

  function onReferenceChange(e: React.ChangeEvent<HTMLInputElement>) {
    setContext((current) =>
      ImmutabilityHelper(current, {
        wishlistItemRequest: {
          href: { $set: e.target.value },
        },
      }),
    );
  }

  function onBlur() {
    setState((current) => ({
      ...current,
      href: wishlistItemRequest.href,
      shouldFetch: true,
    }));
  }

  function LinkPreview() {
    if (!state.metadata || error) {
      return null;
    }

    const { title } = state.metadata;
    return (
      <Card>
        <CardMedia />
        <CardContent>
          <Typography>{title}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <FormControl>
      <Stack spacing={4}>
        <TextField
          type={'url'}
          name={'href'}
          label={'Reference link:'}
          value={wishlistItemRequest.href}
          placeholder={'https://example.com'}
          onChange={onReferenceChange}
          onBlur={onBlur}
          error={error}
          helperText={error ? ERROR_TEXT : null}
          InputProps={{
            startAdornment: (
              <InputAdornment position={'start'}>
                <QrCodeIcon />
              </InputAdornment>
            ),
          }}
        />
        <LinkPreview />
      </Stack>
    </FormControl>
  );
}

interface ReferenceFieldState {
  href: string | undefined;
  metadata: Metadata;
  shouldFetch: boolean;
  showHelperText: boolean;
}

type Metadata = {
  title: string;
  description: string;
} | null;
