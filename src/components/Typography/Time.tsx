import type { TypographyProps } from '@mui/material';
import { Typography } from '@mui/material';

import ZDate from 'utils/lib/date';

export default function Time({ date, ...props }: TimeProps) {
  if (!date) return null;
  return (
    <Typography
      variant={'body2'}
      component={'time'}
      display={'block'}
      dateTime={ZDate.formatISO(date)}
      {...props}>
      {ZDate.format(date)}
    </Typography>
  );
}

interface TimeProps extends TypographyProps<'time'> {
  date: Date | null;
}
