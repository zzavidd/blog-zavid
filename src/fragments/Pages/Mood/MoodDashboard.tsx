import { Container, useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { trpc } from 'utils/trpc';

import MoodForm from './MoodForm';
import MoodTable from './MoodTable';

export default function MoodDashboard({ params }: MoodDashboardProps) {
  const { data: moods = [] } = trpc.mood.findMany.useQuery(params);
  const theme = useTheme();

  return (
    <Container maxWidth={false}>
      <Grid container={true} columns={12} spacing={2}>
        <Grid xs={12} lg={5}>
          <MoodTable params={params} />
        </Grid>
        <Grid xs={12} lg={7}>
          <ResponsiveContainer width={'100%'} height={400}>
            <LineChart data={moods}>
              <Line
                type={'monotone'}
                dataKey={'value'}
                stroke={theme.palette.primary.main}
              />
              <XAxis
                dataKey={'date'}
                tickFormatter={(date) => dayjs(date).format('DD MMM')}
              />
              <YAxis type={'number'} domain={[0, 10]} allowDecimals={false} />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
      <MoodForm />
    </Container>
  );
}

interface MoodDashboardProps {
  params: MoodFindManyInput;
}
