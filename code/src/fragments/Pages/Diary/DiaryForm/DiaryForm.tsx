import {
  Check as CheckIcon,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import type { SelectChangeEvent, SxProps, Theme } from '@mui/material';
import {
  Checkbox,
  Chip,
  Container,
  Divider,
  Fade,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DiaryStatus } from '@prisma/client';
import dayjs from 'dayjs';
import immutate from 'immutability-helper';
import React, { useContext, useRef } from 'react';

import { LinkButton } from 'components/Link';

import { DiaryFormContext } from './DiaryForm.context';

export default function DiaryForm({
  onSubmit,
  submitText,
  isActionLoading,
}: DiaryFormProps) {
  const [context, setContext] = useContext(DiaryFormContext);
  const { entry } = context;

  const isPublish = entry.status === DiaryStatus.PUBLISHED;

  function onTextChange(e: ChangeEvent) {
    const { name, value } = e.target;
    setContext((c) => immutate(c, { entry: { [name]: { $set: value } } }));
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

  const stackRowProps: SxProps<Theme> = {
    direction: { xs: 'column', md: 'row' },
    spacing: 5,
  };

  return (
    <Container maxWidth={false} disableGutters={true}>
      <Container maxWidth={'xl'}>
        <Stack mx={{ xs: 3, md: 5 }} my={5} spacing={5}>
          <Typography variant={'h2'}>Add New Diary Entry</Typography>
          <Stack {...stackRowProps}>
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
              <Stack {...stackRowProps}>
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
              </Stack>
              <FormControl fullWidth={true}>
                <TextField
                  name={'footnote'}
                  label={'Footnote:'}
                  multiline={true}
                  minRows={3}
                  value={entry.footnote}
                  onChange={onTextChange}
                  placeholder={
                    'Add any footnotes to come after the signature...'
                  }
                />
              </FormControl>
              <Stack {...stackRowProps}>
                <FormControl fullWidth={true}>
                  <InputLabel>Status:</InputLabel>
                  <Select
                    name={'status'}
                    label={'Status.:'}
                    value={entry.status}
                    onChange={onTextChange}>
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
              </Stack>
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
          </Stack>
          <Divider />
        </Stack>
      </Container>
      <Toolbar
        disableGutters={true}
        component={Paper}
        sx={{
          backgroundColor: (t) => t.palette.background.paper,
          bottom: 0,
          position: 'sticky',
        }}>
        <Stack
          direction={'row'}
          justifyContent={'flex-end'}
          spacing={3}
          width={'100%'}
          m={3}>
          <LinkButton href={'/admin/diary'}>Cancel</LinkButton>
          <LoadingButton
            variant={'contained'}
            onClick={onSubmit}
            loading={isActionLoading}>
            {submitText}
          </LoadingButton>
        </Stack>
      </Toolbar>
    </Container>
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
  onSubmit: () => void;
  submitText: string;
  isActionLoading: boolean;
}

type ChangeEvent =
  | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | SelectChangeEvent;
