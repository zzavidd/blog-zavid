import { ArrowDropUp } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  ButtonGroup,
  FormControl,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import immutate from 'immutability-helper';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useContext, useRef, useState } from 'react';

import { ActionDialog } from 'components/Dialog';
import Form, { FormRow } from 'components/Form';
import { LinkButton } from 'components/Link';
import { embedSubscriber } from 'utils/functions';
import { AppActions, useAppDispatch } from 'utils/reducers';
import { trpc } from 'utils/trpc';

import { AnnounceFormContext } from './AnnounceForm.context';

export default function AnnounceForm() {
  const [state, setState] = useState({
    isPublishModalVisible: false,
    isButtonMenuVisible: false,
    selectedSubmitIndex: 0,
  });
  const [context, setContext] = useContext(AnnounceFormContext);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();

  const { mutate: announce, isLoading: isAnnounceLoading } =
    trpc.subscriber.announce.useMutation({
      onError: (e) => {
        enqueueSnackbar(e.message, { variant: 'error' });
      },
    });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { announcement } = context;
  const buttonMenuItems: ButtonMenuItem[] = [
    {
      label: 'Save draft',
      onSubmit: () => {
        dispatch(AppActions.saveAnnouncementDraft(context.announcement));
        enqueueSnackbar('Saved announcement draft.', { variant: 'success' });
      },
    },
    {
      label: 'Send test (Ethereal)',
      onSubmit: () => {
        announce(
          {
            announcement: context.announcement,
            options: { isPreview: true, previewType: 'Ethereal' },
          },
          {
            onSuccess: (url) => {
              enqueueSnackbar('Test announcement send to Ethereal email.', {
                variant: 'success',
              });
              window.open(url, '_blank');
            },
          },
        );
      },
      disabled: process.env.NEXT_PUBLIC_APP_ENV === 'production',
    },
    {
      label: 'Send test (Gmail)',
      onSubmit: () => {
        announce(
          {
            announcement: context.announcement,
            options: { isPreview: true, previewType: 'Gmail' },
          },
          {
            onSuccess: () => {
              enqueueSnackbar(
                'Test announcement send to administrator email.',
                {
                  variant: 'success',
                },
              );
            },
          },
        );
      },
    },
    {
      label: 'Send',
      onSubmit: () => {
        setState((s) => ({ ...s, isPublishModalVisible: true }));
      },
    },
  ];

  function onTextChange(e: ChangeEvent) {
    const { name, value } = e.target;
    setContext((c) =>
      immutate(c, { announcement: { [name]: { $set: value } } }),
    );
  }

  function onSubmitClick() {
    buttonMenuItems[state.selectedSubmitIndex].onSubmit();
  }

  function onSubmitConfirm() {
    announce(
      {
        announcement: context.announcement,
        options: { isPreview: false },
      },
      {
        onSuccess: () => {
          enqueueSnackbar('Successfully announced to all subscribers.', {
            variant: 'success',
          });
          void router.push('/admin/subscribers');
        },
      },
    );
  }

  function onButtonMenuChange(index: number) {
    setState((s) => ({ ...s, selectedSubmitIndex: index }));
  }

  function openButtonMenu() {
    setState((s) => ({ ...s, isButtonMenuVisible: true }));
  }

  function closeButtonMenu() {
    setState((s) => ({ ...s, isButtonMenuVisible: false }));
  }

  function closePublishModal() {
    setState((s) => ({ ...s, isPublishModalVisible: false }));
  }

  const FormContent = (
    <React.Fragment>
      <Typography variant={'h2'}>Send Announcement</Typography>
      <FormRow>
        <Stack width={'100%'}>
          <FormControl fullWidth={true}>
            <TextField
              name={'content'}
              label={'Content:'}
              multiline={true}
              minRows={5}
              value={announcement.content}
              onChange={onTextChange}
              placeholder={'Scribe your announcement to your subscribers...'}
            />
          </FormControl>
        </Stack>
        <Stack spacing={5} width={'100%'}>
          <FormControl fullWidth={true}>
            <TextField
              name={'subject'}
              label={'Subject:'}
              value={announcement.subject}
              onChange={onTextChange}
              placeholder={'Enter the subject'}
            />
          </FormControl>
          <FormControl fullWidth={true}>
            <TextField
              name={'preview'}
              label={'Preview:'}
              multiline={true}
              minRows={3}
              value={announcement.preview}
              onChange={onTextChange}
              placeholder={
                'Add the preview text to show on the email notification...'
              }
            />
          </FormControl>
          <FormControl fullWidth={true}>
            <TextField
              name={'endearment'}
              label={'Endearment:'}
              value={announcement.endearment}
              onChange={onTextChange}
              placeholder={'Enter an endearment for nameless subscribers'}
            />
          </FormControl>
        </Stack>
      </FormRow>
    </React.Fragment>
  );

  const ToolbarActions = (
    <React.Fragment>
      <LinkButton href={'/admin/subscribers'}>Cancel</LinkButton>
      <ButtonGroup>
        <LoadingButton
          variant={'contained'}
          onClick={onSubmitClick}
          loading={isAnnounceLoading}>
          {buttonMenuItems[state.selectedSubmitIndex].label}
        </LoadingButton>
        <Button variant={'contained'} onClick={openButtonMenu} ref={buttonRef}>
          <ArrowDropUp />
        </Button>
      </ButtonGroup>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Form
        Content={FormContent}
        ToolbarActions={ToolbarActions}
        previewContent={embedSubscriber(announcement, 'Ozioma')}
        previewTitle={announcement.subject}
      />
      <ActionDialog
        open={state.isPublishModalVisible}
        onConfirm={onSubmitConfirm}
        onCancel={closePublishModal}
        confirmText={'Send announcement'}
        isActionLoading={isAnnounceLoading}>
        By sending this announcement, you&#39;ll be notifying all subscribers.
        Confirm that you want to send out this announcment.
      </ActionDialog>
      <Menu
        open={state.isButtonMenuVisible}
        anchorEl={buttonRef.current}
        anchorOrigin={{ vertical: -120, horizontal: 'center' }}
        onClick={closeButtonMenu}
        onClose={closeButtonMenu}>
        <MenuList autoFocusItem={true} disablePadding={true}>
          {buttonMenuItems.map(({ label, disabled }, key) => (
            <MenuItem
              disabled={disabled}
              selected={state.selectedSubmitIndex === key}
              onClick={() => onButtonMenuChange(key)}
              sx={{ py: 4 }}
              key={key}>
              <ListItemText primaryTypographyProps={{ variant: 'button' }}>
                {label}
              </ListItemText>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </React.Fragment>
  );
}

interface ButtonMenuItem {
  label: string;
  onSubmit: () => void;
  disabled?: boolean;
}
