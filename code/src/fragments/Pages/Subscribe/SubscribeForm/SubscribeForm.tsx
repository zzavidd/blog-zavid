import { LoadingButton } from '@mui/lab';
import {
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import immutate from 'immutability-helper';
import { useSnackbar } from 'notistack';
import React, { useContext } from 'react';

import SuggestiveLinks from 'fragments/Shared/SuggestiveLinks';
import { trpc } from 'utils/trpc';
import { zSubscribeForm } from 'utils/validators';

import { SubscribeFormContext } from './SubscribeForm.context';

export default function SubscribeForm() {
  const [context] = useContext(SubscribeFormContext);
  if (context.isSubmitted) {
    return <Completion />;
  }
  return <Form />;
}

function Completion() {
  const [context] = useContext(SubscribeFormContext);
  return (
    <Container maxWidth={'sm'} sx={{ alignSelf: 'center' }}>
      <Stack alignItems={'center'} spacing={4}>
        <Typography
          variant={'body1'}
          textAlign={'center'}
          data-testId={'zb.completionText'}>
          Thank you for subscribing!
          <br />
          I&apos;ve added&nbsp;
          <strong>{context.subscriber.email || 'you'}</strong>&nbsp;to my
          mailing list.
        </Typography>
        <SuggestiveLinks />
      </Stack>
    </Container>
  );
}

function Form() {
  const [context, setContext] = useContext(SubscribeFormContext);
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: addSubscriber, isLoading: isCreateLoading } =
    trpc.subscriber.create.useMutation();

  function onTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setContext((s) => immutate(s, { subscriber: { [name]: { $set: value } } }));
  }

  function onSubscriptionChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = e.target;
    setContext((s) =>
      immutate(s, {
        subscriber: { subscriptions: { [name]: { $set: checked } } },
      }),
    );
  }

  function submitSubscriber() {
    const result = zSubscribeForm.safeParse(context.subscriber);
    if (!result.success) {
      return enqueueSnackbar(result.error.issues[0].message, {
        variant: 'error',
      });
    }

    addSubscriber(
      { data: context.subscriber },
      {
        onSuccess: () => {
          setContext((s) => immutate(s, { isSubmitted: { $set: true } }));
        },
        onError: (e) => {
          enqueueSnackbar(e.message, { variant: 'error' });
        },
      },
    );
  }

  return (
    <Container maxWidth={'sm'}>
      <Stack mx={{ xs: 4, md: 5 }} my={5} spacing={5}>
        <Stack spacing={3}>
          <Typography variant={'h2'}>Subscribe to Zavid</Typography>
          <Typography variant={'body1'}>
            You know what they say: first come, first served. Be among the first
            notified when a new post or diary entry drops.
          </Typography>
        </Stack>
        <FormControl>
          <TextField
            type={'email'}
            name={'email'}
            label={'Email:'}
            onChange={onTextChange}
            required={true}
            placeholder={'Enter your email address...'}
            inputProps={{
              'data-testid': 'zb.email',
            }}
          />
        </FormControl>
        <Stack direction={'row'} spacing={5}>
          <FormControl fullWidth={true}>
            <TextField
              type={'text'}
              name={'firstname'}
              label={'First Name:'}
              onChange={onTextChange}
              placeholder={'Enter your first name...'}
              inputProps={{
                'data-testid': 'zb.firstname',
              }}
            />
          </FormControl>
          <FormControl fullWidth={true}>
            <TextField
              type={'text'}
              name={'lastname'}
              label={'Last Name:'}
              onChange={onTextChange}
              placeholder={'Enter your last name...'}
              inputProps={{
                'data-testid': 'zb.lastname',
              }}
            />
          </FormControl>
        </Stack>
        <Stack>
          <Typography variant={'h5'}>Subscribe to:</Typography>
          <FormGroup>
            {Object.entries(context.subscriber.subscriptions).map(
              ([type, checked]) => (
                <FormControlLabel
                  label={type}
                  control={
                    <Checkbox
                      name={type}
                      checked={checked}
                      onChange={onSubscriptionChange}
                      sx={{ ml: 2, mr: 1 }}
                    />
                  }
                  key={type}
                />
              ),
            )}
          </FormGroup>
        </Stack>
        <Stack direction={'row'} spacing={4}>
          <LoadingButton
            variant={'contained'}
            onClick={submitSubscriber}
            loading={isCreateLoading}
            sx={{ px: 7 }}
            data-testid={'zb.submit'}>
            Submit
          </LoadingButton>
        </Stack>
      </Stack>
    </Container>
  );
}
