import { ArrowDropUp } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import type { SelectChangeEvent } from '@mui/material';
import {
  Button,
  ButtonGroup,
  Fade,
  FormControl,
  InputLabel,
  Link,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { ExclusiveStatus } from '@prisma/client';
import dayjs from 'dayjs';
import immutate from 'immutability-helper';
import React, { useContext, useRef, useState } from 'react';

import { ActionDialog } from 'components/Dialog';
import Form, { FormRow } from 'components/Form';
import { LinkButton } from 'components/Link';
import { embedSubscriber } from 'utils/functions';
import ZString from 'utils/lib/string';

import { ExclusiveFormContext } from './ExclusiveForm.context';

export default function ExclusiveForm({
  onSubmit,
  submitText,
  heading,
  isActionLoading,
}: PostsFormProps) {
  const [state, setState] = useState({
    isPublishModalVisible: false,
    isButtonMenuVisible: false,
    selectedSubmitIndex: 0,
  });
  const [context, setContext] = useContext(ExclusiveFormContext);
  const { exclusive } = context;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const buttonMenuItems = [
    { label: `${submitText} only`, isPublish: false },
    {
      label: `${submitText} & Send`,
      isPublish: true,
      disabled: exclusive.status !== ExclusiveStatus.PUBLISHED,
    },
  ];

  function onTextChange(e: ChangeEvent) {
    const { name, value } = e.target;
    setContext((c) => immutate(c, { exclusive: { [name]: { $set: value } } }));
  }

  function onSubjectChange(e: ChangeEvent) {
    const { value } = e.target;
    setContext((c) =>
      immutate(c, {
        exclusive: {
          subject: { $set: value },
          slug: { $set: ZString.createSlug(value) },
        },
      }),
    );
  }

  function onStatusChange(e: SelectChangeEvent) {
    const value = e.target.value as ExclusiveStatus;
    setContext((c) => immutate(c, { exclusive: { status: { $set: value } } }));
    if (value !== ExclusiveStatus.PUBLISHED) {
      setState((s) => ({ ...s, selectedSubmitIndex: 0 }));
    }
  }

  function onDateChange(value: dayjs.Dayjs | null) {
    // Sets value to 12th hour to prevent any unwanted date mishaps.
    const date = value?.set('hour', 12).toDate();
    setContext((c) =>
      immutate(c, {
        exclusive: { date: { $set: date } },
      }),
    );
  }

  function onSubmitClick() {
    if (buttonMenuItems[state.selectedSubmitIndex].isPublish) {
      setState((s) => ({ ...s, isPublishModalVisible: true }));
    } else {
      onSubmit(false);
    }
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
      <Typography variant={'h2'}>{heading}</Typography>
      <FormRow>
        <Stack width={'100%'}>
          <FormControl fullWidth={true}>
            <TextField
              name={'content'}
              label={'Content:'}
              multiline={true}
              minRows={5}
              value={exclusive.content}
              onChange={onTextChange}
              placeholder={'Scribe your exclusive to your subscribers...'}
            />
          </FormControl>
        </Stack>
        <Stack spacing={5} width={'100%'}>
          <FormControl fullWidth={true}>
            <TextField
              name={'subject'}
              label={'Subject:'}
              value={exclusive.subject}
              onChange={onSubjectChange}
              placeholder={'Enter the subject'}
            />
          </FormControl>
          <FormControl fullWidth={true}>
            <TextField
              name={'preview'}
              label={'Preview:'}
              multiline={true}
              minRows={3}
              value={exclusive.preview}
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
              value={exclusive.endearment}
              onChange={onTextChange}
              placeholder={'Enter an endearment for nameless subscribers'}
            />
          </FormControl>
          <FormRow>
            <FormControl fullWidth={true}>
              <InputLabel>Status:</InputLabel>
              <Select
                name={'status'}
                label={'Status.:'}
                value={exclusive.status}
                onChange={onStatusChange}>
                {Object.values(ExclusiveStatus).map((status) => (
                  <MenuItem value={status} key={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Fade in={exclusive.status !== ExclusiveStatus.DRAFT}>
              <FormControl fullWidth={true}>
                <DatePicker
                  label={'Date Published:'}
                  value={exclusive.date ? dayjs(exclusive.date) : null}
                  onChange={onDateChange}
                  format={'dddd DD MMMM YYYY'}
                  slotProps={{
                    textField: {
                      helperText: exclusive.date ? (
                        <Link
                          href={'#'}
                          color={'inherit'}
                          underline={'hover'}
                          onClick={() => onDateChange(null)}>
                          Clear date
                        </Link>
                      ) : null,
                    },
                  }}
                />
              </FormControl>
            </Fade>
          </FormRow>
          <FormControl fullWidth={true}>
            <TextField
              name={'slug'}
              label={'Slug:'}
              value={exclusive.slug}
              placeholder={'Enter the slug'}
              disabled={true}
            />
          </FormControl>
        </Stack>
      </FormRow>
    </React.Fragment>
  );

  const ToolbarActions = (
    <React.Fragment>
      <LinkButton href={'/admin/exclusives'}>Cancel</LinkButton>
      <ButtonGroup>
        <LoadingButton
          variant={'contained'}
          onClick={onSubmitClick}
          loading={isActionLoading}>
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
        previewContent={embedSubscriber(exclusive, 'Ozioma')}
        previewTitle={exclusive.subject}
      />
      <ActionDialog
        open={state.isPublishModalVisible}
        onConfirm={() => onSubmit(true)}
        onCancel={closePublishModal}
        confirmText={'Send exclusive'}
        isActionLoading={isActionLoading}>
        <Typography>
          By sending this exclusive, you&#39;ll be notifying all subscribers.
          Confirm that you want to send out this announcment.
        </Typography>
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

interface PostsFormProps {
  onSubmit: (isPublish: boolean) => void;
  submitText: string;
  heading: string;
  isActionLoading: boolean;
}
