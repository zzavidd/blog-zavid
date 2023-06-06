import {
  ArrowDropUp,
  Check as CheckIcon,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import type { SelectChangeEvent } from '@mui/material';
import {
  Button,
  ButtonGroup,
  Checkbox,
  Chip,
  Fade,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DiaryStatus } from '@prisma/client';
import dayjs from 'dayjs';
import immutate from 'immutability-helper';
import React, { useContext, useRef, useState } from 'react';

import { ActionDialog } from 'components/Dialog';
import Form, { FormRow } from 'components/Form';
import { LinkButton } from 'components/Link';

import { DiaryFormContext } from './DiaryForm.context';

export default function DiaryForm({
  onSubmit,
  submitText,
  isActionLoading,
  isPublish,
}: DiaryFormProps) {
  const [state, setState] = useState({
    isPublishModalVisible: false,
    isButtonMenuVisible: false,
    selectedSubmitIndex: 0,
  });
  const [context, setContext] = useContext(DiaryFormContext);
  const { entry } = context;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const buttonMenuItems = [
    { label: `${submitText} only`, isPublish: false },
    {
      label: `${submitText} & Publish`,
      isPublish: true,
      disabled: entry.status !== DiaryStatus.PUBLISHED,
    },
  ];

  function onTextChange(e: ChangeEvent) {
    const { name, value } = e.target;
    setContext((c) => immutate(c, { entry: { [name]: { $set: value } } }));
  }

  function onStatusChange(e: SelectChangeEvent) {
    const value = e.target.value as DiaryStatus;
    setContext((c) => immutate(c, { entry: { status: { $set: value } } }));
    if (value !== DiaryStatus.PUBLISHED) {
      setState((s) => ({ ...s, selectedSubmitIndex: 0 }));
    }
  }

  function onCheckboxChange(e: ChangeEvent, checked: boolean) {
    const { name } = e.target;
    setContext((c) => immutate(c, { entry: { [name]: { $set: checked } } }));
  }

  function onDateChange(date: dayjs.Dayjs | null) {
    setContext((c) =>
      immutate(c, { entry: { date: { $set: date?.toDate() } } }),
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
      <Typography variant={'h2'}>Add New Diary Entry</Typography>
      <FormRow>
        <Stack width={'100%'}>
          <FormControl fullWidth={true}>
            <TextField
              name={'content'}
              label={'Content:'}
              multiline={true}
              minRows={5}
              value={entry.content}
              onChange={onTextChange}
              placeholder={'Scribe your thoughts and feelings...'}
            />
          </FormControl>
        </Stack>
        <Stack spacing={5} width={'100%'}>
          <FormRow>
            <FormControl fullWidth={true}>
              <TextField
                name={'title'}
                label={'Title:'}
                value={entry.title}
                onChange={onTextChange}
                placeholder={'Enter the title'}
              />
            </FormControl>
            <FormControl>
              <TextField
                name={'entryNumber'}
                type={'number'}
                label={'Entry No.:'}
                value={entry.entryNumber}
                onChange={onTextChange}
                placeholder={'No.'}
                inputProps={{
                  inputMode: 'numeric',
                  min: 1,
                  pattern: '[0-9]*',
                }}
              />
            </FormControl>
          </FormRow>
          <FormControl fullWidth={true}>
            <TextField
              name={'footnote'}
              label={'Footnote:'}
              multiline={true}
              minRows={3}
              value={entry.footnote}
              onChange={onTextChange}
              placeholder={'Add any footnotes to come after the signature...'}
            />
          </FormControl>
          <FormRow>
            <FormControl fullWidth={true}>
              <InputLabel>Status:</InputLabel>
              <Select
                name={'status'}
                label={'Status.:'}
                value={entry.status}
                onChange={onStatusChange}>
                {Object.values(DiaryStatus).map((status) => (
                  <MenuItem value={status} key={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Fade in={isPublish}>
              <FormControl fullWidth={true}>
                <DatePicker
                  label={'Date Published:'}
                  value={entry.date ? dayjs(entry.date) : undefined}
                  onChange={onDateChange}
                  format={'dddd DD MMMM YYYY'}
                />
              </FormControl>
            </Fade>
          </FormRow>
          <FormControlLabel
            label={'This diary entry is a favourite.'}
            control={
              <Checkbox
                name={'isFavourite'}
                checked={entry.isFavourite}
                onChange={onCheckboxChange}
                icon={<FavoriteBorder fontSize={'large'} />}
                checkedIcon={<Favorite fontSize={'large'} />}
                sx={{ mr: 1 }}
              />
            }
          />
          <TagsInput />
        </Stack>
      </FormRow>
    </React.Fragment>
  );

  const ToolbarActions = (
    <React.Fragment>
      <LinkButton href={'/admin/diary'}>Cancel</LinkButton>
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
        previewContent={entry.content}
        previewTitle={entry.title}
      />
      <ActionDialog
        open={state.isPublishModalVisible}
        onConfirm={() => onSubmit(true)}
        onCancel={closePublishModal}
        confirmText={'Publish'}
        isActionLoading={isActionLoading}>
        By publishing this diary entry, you&#39;ll be notifying all subscribers
        of this new release. Confirm that you want to publish.
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

function TagsInput() {
  const [context, setContext] = useContext(DiaryFormContext);
  const textFieldRef = useRef<HTMLInputElement>(null);

  function onChange(e: ChangeEvent) {
    setContext((c) => immutate(c, { tagsInput: { $set: e.target.value } }));
  }

  function onEnterKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && context.tagsInput.length) {
      onConfirm();
    }
  }

  function onConfirm() {
    setContext((c) =>
      immutate(c, {
        entry: { tags: { $push: [context.tagsInput] } },
        tagsInput: { $set: '' },
      }),
    );
    textFieldRef.current?.focus();
  }

  function onChipDelete(index: number) {
    setContext((c) =>
      immutate(c, {
        entry: { tags: { $splice: [[index, 1]] } },
      }),
    );
  }

  const tagsList = (context.entry.tags ?? []) as string[];
  return (
    <Stack spacing={3}>
      <FormControl fullWidth={true}>
        <TextField
          name={'tags'}
          label={'Tags:'}
          value={context.tagsInput}
          onChange={onChange}
          onKeyDown={onEnterKeyPress}
          placeholder={'Add tags to index the entry...'}
          ref={textFieldRef}
          InputProps={{
            endAdornment: (
              <Fade in={!!context.tagsInput.length}>
                <InputAdornment position={'end'}>
                  <IconButton onClick={onConfirm}>
                    <CheckIcon />
                  </IconButton>
                </InputAdornment>
              </Fade>
            ),
          }}
        />
      </FormControl>
      <Stack direction={'row'} flexWrap={'wrap'} spacing={2} useFlexGap={true}>
        {tagsList.map((tag, index) => (
          <Chip
            label={tag}
            variant={'outlined'}
            onDelete={() => onChipDelete(index)}
            sx={{ px: 1, py: 4 }}
            key={index}
          />
        ))}
      </Stack>
    </Stack>
  );
}

interface DiaryFormProps {
  onSubmit: (isPublish: boolean) => void;
  submitText: string;
  isActionLoading: boolean;
  isPublish: boolean;
}

type ChangeEvent =
  | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | SelectChangeEvent;
