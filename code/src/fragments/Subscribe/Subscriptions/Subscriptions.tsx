import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import immutate from 'immutability-helper';
import { useSnackbar } from 'notistack';
import React, { useContext } from 'react';

import { ActionDialog } from 'components/Dialog';
import SuggestiveLinks from 'fragments/Shared/SuggestiveLinks';
import type { SubscriptionType } from 'utils/enum';
import { trpc } from 'utils/trpc';

import { SubscriptionsContext } from './Subscriptions.context';

export default function Subscriptions() {
  const [context] = useContext(SubscriptionsContext);

  if (context.isUnsubscribeComplete) {
    return <UnsubscribeComplete />;
  }

  return (
    <Container maxWidth={'md'}>
      <Stack mx={{ xs: 4, md: 5 }} my={5} spacing={4}>
        <Typography variant={'h2'}>Subscription Preferences</Typography>
        <Content />
      </Stack>
    </Container>
  );
}

function UnsubscribeComplete() {
  return (
    <Container maxWidth={'md'} sx={{ alignSelf: 'center' }}>
      <Stack alignItems={'center'} spacing={4}>
        <Typography variant={'body1'} textAlign={'center'}>
          I&apos;ve unsubscribed you from my blog.
          <br />
          Sorry to see you go!
        </Typography>
        <SuggestiveLinks />
      </Stack>
    </Container>
  );
}

function Content() {
  const [context, setContext] = useContext(SubscriptionsContext);
  const { mutate: updateSubscriber, isLoading: isUpdateLoading } =
    trpc.subscriber.update.useMutation();
  const { mutate: deleteSubscriber, isLoading: isDeleteLoading } =
    trpc.subscriber.delete.useMutation();
  const { enqueueSnackbar } = useSnackbar();

  function onSubscriptionChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = e.target;
    setContext((s) =>
      immutate(s, {
        subscriber: { subscriptions: { [name]: { $set: checked } } },
      }),
    );
  }

  if (!context.subscriber || !Object.keys(context.subscriber).length) {
    return (
      <Stack>
        <Skeleton variant={'text'} width={'100%'} />
        <Skeleton variant={'text'} width={'100%'} />
        <Skeleton variant={'text'} width={'70%'} />
      </Stack>
    );
  }

  function onUpdateClick() {
    updateSubscriber(
      {
        data: context.subscriber,
        where: { email: String(context.subscriber.email) },
      },
      {
        onSuccess: () => {
          enqueueSnackbar(
            "I've successfully updated your subscription preferences.",
            {
              variant: 'success',
            },
          );
        },
      },
    );
  }

  function onUnsubscribeConfirm() {
    deleteSubscriber(
      {
        where: { email: String(context.subscriber.email) },
      },
      {
        onSuccess: () => {
          setContext((c) => ({ ...c, isUnsubscribeComplete: true }));
        },
      },
    );
  }

  function onUnsubscribeClick() {
    setContext((c) => ({ ...c, isDeleteModalVisible: true }));
  }

  function closeUnsubscribeModal() {
    setContext((c) => ({ ...c, isDeleteModalVisible: false }));
  }

  return (
    <React.Fragment>
      <Stack spacing={5}>
        <Stack spacing={3}>
          <Typography variant={'body1'}>
            {String(context.subscriber.email)}
          </Typography>
          <Typography variant={'h5'}>You are subscribed to my:</Typography>
          <FormGroup>
            {Object.entries(
              context.subscriber.subscriptions as Record<
                SubscriptionType,
                boolean
              >,
            ).map(([type, checked]) => (
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
            ))}
          </FormGroup>
        </Stack>
        <Box>
          <LoadingButton
            variant={'contained'}
            onClick={onUpdateClick}
            loading={isUpdateLoading}>
            Update Preferences
          </LoadingButton>
        </Box>
        <Box>
          <Button variant={'text'} onClick={onUnsubscribeClick}>
            Unsubscribe
          </Button>
        </Box>
      </Stack>
      <ActionDialog
        open={context.isDeleteModalVisible}
        onConfirm={onUnsubscribeConfirm}
        onCancel={closeUnsubscribeModal}
        confirmText={'Unsubscribe'}
        isActionDestructive={true}
        isActionLoading={isDeleteLoading}>
        Are you sure you want this to work?
      </ActionDialog>
    </React.Fragment>
  );
}
