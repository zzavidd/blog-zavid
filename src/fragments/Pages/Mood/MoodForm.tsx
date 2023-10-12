import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MoodTimeOfDay } from '@prisma/client';
import dayjs from 'dayjs';
import immutate from 'immutability-helper';
import { useSnackbar } from 'notistack';
import { useContext } from 'react';

import { trpc } from 'utils/trpc';

import { MoodDashboardContext } from './MoodDashboard.context';

export default function MoodForm() {
  const [context, setContext] = useContext(MoodDashboardContext);
  const trpcContext = trpc.useContext();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: createMood, isLoading: isCreateLoading } =
    trpc.mood.create.useMutation({
      onSuccess: () => {
        void trpcContext.mood.findMany.refetch();
        enqueueSnackbar('Successfully added new mood.', { variant: 'success' });
        onClose();
      },
      onError: (e) => {
        enqueueSnackbar(e.message, { variant: 'error' });
      },
    });

  function onDateChange(date: dayjs.Dayjs | null) {
    setContext((c) =>
      immutate(c, { mood: { date: { $set: date?.toDate() || new Date() } } }),
    );
  }

  function onTimeOfDayChange(
    _: React.MouseEvent<HTMLElement>,
    [timeOfDay]: MoodTimeOfDay[],
  ) {
    setContext((c) =>
      immutate(c, { mood: { timeOfDay: { $set: timeOfDay } } }),
    );
  }

  function onValueChange(e: ChangeEvent) {
    setContext((c) =>
      immutate(c, { mood: { value: { $set: Number(e.target.value) } } }),
    );
  }

  function onReasonChange(e: ChangeEvent) {
    setContext((c) =>
      immutate(c, { mood: { reason: { $set: e.target.value } } }),
    );
  }

  function onSubmit() {
    createMood({ data: context.mood });
  }

  function onClose() {
    setContext((c) => ({ ...c, isMoodFormOpen: false }));
  }

  return (
    <Dialog open={context.isMoodFormOpen} maxWidth={'xs'} fullWidth={true}>
      <DialogTitle typography={'body1'}>Add Mood Entry</DialogTitle>
      <DialogContent>
        <Stack rowGap={4}>
          <FormControl fullWidth={true}>
            <DatePicker
              label={'Date:'}
              value={dayjs(context.mood.date)}
              onChange={onDateChange}
              format={'dddd DD MMMM YYYY'}
              slotProps={{ textField: { margin: 'dense' } }}
            />
          </FormControl>
          <ToggleButtonGroup onChange={onTimeOfDayChange}>
            {Object.values(MoodTimeOfDay).map((value) => (
              <ToggleButton
                value={value}
                selected={context.mood.timeOfDay === value}
                key={value}>
                {value}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <FormControl fullWidth={true}>
            <TextField
              name={'value'}
              type={'number'}
              label={'Value:'}
              value={context.mood.value}
              onChange={onValueChange}
              placeholder={'0'}
              inputProps={{
                inputMode: 'numeric',
                min: 0,
                max: 10,
                pattern: '[0-9]*',
              }}
            />
          </FormControl>
          <FormControl fullWidth={true}>
            <TextField
              name={'reason'}
              label={'Reason:'}
              value={context.mood.reason}
              onChange={onReasonChange}
              placeholder={'State the reason for the mood change...'}
            />
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ padding: (t) => t.spacing(4, 5, 5, 5) }}>
        <Button variant={'outlined'} onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          variant={'contained'}
          onClick={onSubmit}
          color={'primary'}
          loading={isCreateLoading}>
          Add
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
