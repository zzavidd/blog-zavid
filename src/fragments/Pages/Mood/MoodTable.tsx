import { Add } from '@mui/icons-material';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import dayjs from 'dayjs';
import { useContext } from 'react';

import { trpc } from 'utils/trpc';

import { MoodDashboardContext } from './MoodDashboard.context';

export default function MoodTable({ params }: MoodTableProps) {
  const [, setContext] = useContext(MoodDashboardContext);
  const { data: moods = [] } = trpc.mood.findMany.useQuery(params);

  function showMoodForm() {
    setContext((c) => ({ ...c, isMoodFormOpen: true }));
  }

  return (
    <Paper>
      <TableContainer
        sx={{
          borderBottom: (t) => `2px solid ${t.palette.divider}`,
          maxHeight: (t) => t.spacing(14),
        }}>
        <Table stickyHeader={true}>
          <TableHead>
            <TableRow>
              <TableCell
                align={'center'}
                sx={{ minWidth: (t) => t.spacing(9) }}>
                Date
              </TableCell>
              <TableCell
                align={'center'}
                sx={{ minWidth: (t) => t.spacing(10) }}>
                Time of Day
              </TableCell>
              <TableCell align={'center'}>Value</TableCell>
              <TableCell sx={{ maxWidth: (t) => t.spacing(10) }}>
                Reason
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...moods].reverse().map((mood) => (
              <TableRow hover={true} key={mood.id}>
                <TableCell align={'center'}>
                  {dayjs(mood.date).format('DD MMM YY')}
                </TableCell>
                <TableCell align={'center'}>{mood.timeOfDay}</TableCell>
                <TableCell align={'center'}>{mood.value}</TableCell>
                <TableCell sx={{ maxWidth: (t) => t.spacing(10) }}>
                  {mood.reason}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <Button onClick={showMoodForm} startIcon={<Add />}>
          Add Mood
        </Button>
      </Box>
    </Paper>
  );
}

interface MoodTableProps {
  params: MoodFindManyInput;
}
