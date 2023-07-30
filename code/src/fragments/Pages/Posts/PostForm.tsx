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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PostStatus, PostType } from '@prisma/client';
import dayjs from 'dayjs';
import immutate from 'immutability-helper';
import React, { useContext, useRef, useState } from 'react';

import { ActionDialog } from 'components/Dialog';
import Form, { FormRow } from 'components/Form';
import { LinkButton } from 'components/Link';
import ZString from 'utils/lib/string';

import { PostFormContext } from './PostForm.context';

export default function PostForm({
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
  const [context, setContext] = useContext(PostFormContext);
  const { post } = context;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const buttonMenuItems = [
    { label: `${submitText} only`, isPublish: false },
    {
      label: `${submitText} & Publish`,
      isPublish:
        post.type !== PostType.PASSAGE && post.type !== PostType.ADDENDUM,
      disabled: post.status !== PostStatus.PUBLISHED,
    },
  ];

  function onTextChange(e: ChangeEvent) {
    const { name, value } = e.target;
    setContext((c) => immutate(c, { post: { [name]: { $set: value } } }));
  }

  function onTitleChange(e: ChangeEvent) {
    const { value } = e.target;
    setContext((c) =>
      immutate(c, {
        post: {
          title: { $set: value },
          slug: { $set: ZString.createSlug(value) },
        },
      }),
    );
  }

  function onStatusChange(e: SelectChangeEvent) {
    const value = e.target.value as PostStatus;
    setContext((c) => immutate(c, { post: { status: { $set: value } } }));
    if (value !== PostStatus.PUBLISHED) {
      setState((s) => ({ ...s, selectedSubmitIndex: 0 }));
    }
  }

  function onDateChange(value: dayjs.Dayjs | null) {
    // Sets value to 12th hour to prevent any unwanted date mishaps.
    const date = value?.set('hour', 12).toDate();
    setContext((c) =>
      immutate(c, {
        post: { datePublished: { $set: date } },
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
              value={post.content}
              onChange={onTextChange}
              placeholder={'Scribe your thoughts and feelings...'}
            />
          </FormControl>
        </Stack>
        <Stack spacing={5} width={'100%'}>
          <FormControl fullWidth={true}>
            <TextField
              name={'title'}
              label={'Title:'}
              value={post.title}
              onChange={onTitleChange}
              placeholder={'Enter the title'}
            />
          </FormControl>
          <FormRow>
            <FormControl fullWidth={true}>
              <InputLabel>Type:</InputLabel>
              <Select
                name={'type'}
                label={'Type.:'}
                value={post.type}
                onChange={onTextChange}>
                {Object.values(PostType).map((type) => (
                  <MenuItem value={type} key={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Fade in={post.type === PostType.EPISTLE}>
              <FormControl>
                <TextField
                  name={'typeId'}
                  type={'number'}
                  label={'Type ID.:'}
                  value={post.typeId ?? null}
                  onChange={onTextChange}
                  placeholder={'No.'}
                  inputProps={{
                    inputMode: 'numeric',
                    min: 1,
                    pattern: '[0-9]*',
                  }}
                />
              </FormControl>
            </Fade>
          </FormRow>
          <FormControl fullWidth={true}>
            <TextField
              name={'excerpt'}
              label={'Excerpt:'}
              multiline={true}
              rows={2}
              value={post.excerpt}
              onChange={onTextChange}
              placeholder={
                'Add the excerpt shown as a preview on link cards...'
              }
            />
          </FormControl>
          <FormRow>
            <FormControl fullWidth={true}>
              <InputLabel>Status:</InputLabel>
              <Select
                name={'status'}
                label={'Status.:'}
                value={post.status}
                onChange={onStatusChange}>
                {Object.values(PostStatus).map((status) => (
                  <MenuItem value={status} key={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Fade in={post.status !== PostStatus.DRAFT}>
              <FormControl fullWidth={true}>
                <DatePicker
                  label={'Date Published:'}
                  value={post.datePublished ? dayjs(post.datePublished) : null}
                  onChange={onDateChange}
                  format={'dddd DD MMMM YYYY'}
                  slotProps={{
                    textField: {
                      helperText: post.datePublished ? (
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
              value={post.slug}
              onChange={onTextChange}
              placeholder={'Enter the title'}
              disabled={true}
            />
          </FormControl>
        </Stack>
      </FormRow>
    </React.Fragment>
  );

  const ToolbarActions = (
    <React.Fragment>
      <LinkButton href={'/admin/posts'}>Cancel</LinkButton>
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
        previewContent={post.content}
        previewTitle={post.title}
      />
      <ActionDialog
        open={state.isPublishModalVisible}
        onConfirm={() => onSubmit(true)}
        onCancel={closePublishModal}
        confirmText={'Publish'}
        isActionLoading={isActionLoading}>
        By publishing this post, you&#39;ll be notifying all subscribers of this
        new release. Confirm that you want to publish.
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

type ChangeEvent =
  | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | SelectChangeEvent;
