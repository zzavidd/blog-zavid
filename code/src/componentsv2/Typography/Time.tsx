import type { TypographyProps } from '@mui/material';
import { Typography } from '@mui/material';

import ZDate from 'lib/date';

export function Time({ date, ...props }: TimeProps) {
  return (
    <Typography
      variant={'body1'}
      component={'time'}
      display={'block'}
      dateTime={ZDate.formatISO(date)}
      {...props}>
      {ZDate.format(date)}
    </Typography>
  );
}

interface TimeProps extends TypographyProps<'time'> {
  date: Date;
}
