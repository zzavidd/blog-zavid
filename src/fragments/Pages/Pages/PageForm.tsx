import { LoadingButton } from '@mui/lab';
import type { SelectChangeEvent } from '@mui/material';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import immutate from 'immutability-helper';
import React, { useContext } from 'react';

import Form, { FormRow } from 'components/Form';
import { LinkButton } from 'components/Link';

import { PageFormContext } from './PageForm.context';

export default function PageForm({
  onSubmit,
  submitText,
  isActionLoading,
}: PageFormProps) {
  const [context, setContext] = useContext(PageFormContext);
  const { page } = context;

  function onTextChange(e: ChangeEvent) {
    const { name, value } = e.target;
    setContext((c) => immutate(c, { page: { [name]: { $set: value } } }));
  }

  function onCheckboxChange(e: ChangeEvent, checked: boolean) {
    const { name } = e.target;
    setContext((c) => immutate(c, { page: { [name]: { $set: checked } } }));
  }

  const FormContent = (
    <React.Fragment>
      <Typography variant={'h2'}>Add New Page</Typography>
      <FormRow>
        <Stack width={'100%'}>
          <FormControl fullWidth={true}>
            <TextField
              name={'content'}
              label={'Content:'}
              multiline={true}
              minRows={5}
              value={page.content}
              onChange={onTextChange}
              placeholder={'Type out the page content...'}
            />
          </FormControl>
        </Stack>
        <Stack spacing={5} width={'100%'}>
          <FormRow>
            <FormControl fullWidth={true}>
              <TextField
                name={'title'}
                label={'Title:'}
                value={page.title}
                onChange={onTextChange}
                placeholder={'Enter the title'}
              />
            </FormControl>
            <FormControl>
              <TextField
                name={'slug'}
                label={'Slug:'}
                value={page.slug}
                onChange={onTextChange}
                placeholder={'index'}
                InputProps={{
                  startAdornment: <Typography>/</Typography>,
                }}
              />
            </FormControl>
          </FormRow>
          <FormControlLabel
            label={'This page is embedded.'}
            control={
              <Checkbox
                name={'isEmbed'}
                checked={page.isEmbed}
                onChange={onCheckboxChange}
                sx={{ mr: 1 }}
              />
            }
          />
          <FormControl fullWidth={true}>
            <TextField
              name={'excerpt'}
              label={'Excerpt:'}
              multiline={true}
              minRows={3}
              value={page.excerpt}
              onChange={onTextChange}
              placeholder={'Add a short description for the page except...'}
            />
          </FormControl>
        </Stack>
      </FormRow>
    </React.Fragment>
  );

  const ToolbarActions = (
    <React.Fragment>
      <LinkButton href={'/admin/pages'}>Cancel</LinkButton>
      <LoadingButton
        variant={'contained'}
        onClick={onSubmit}
        loading={isActionLoading}>
        {submitText}
      </LoadingButton>
    </React.Fragment>
  );

  return (
    <Form
      Content={FormContent}
      ToolbarActions={ToolbarActions}
      previewTitle={page.title}
      previewContent={page.content}
    />
  );
}

interface PageFormProps {
  onSubmit: () => void;
  submitText: string;
  isActionLoading: boolean;
}

type ChangeEvent =
  | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | SelectChangeEvent;
