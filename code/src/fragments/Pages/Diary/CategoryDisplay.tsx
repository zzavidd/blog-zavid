import { Circle } from '@mui/icons-material';
import type { StackProps } from '@mui/material';
import { Stack, Typography } from '@mui/material';
import type { DiaryCategory } from '@prisma/client';

export default function CategoryDisplay({
  categories = [],
  fontSize = 11,
  ...props
}: CategoryDisplayProps) {
  return (
    <Stack
      direction={'row'}
      divider={<Circle sx={{ fontSize: Number(fontSize) * (4 / 11) }} />}
      alignItems={'center'}
      spacing={2}
      flexWrap={'wrap'}
      useFlexGap={true}
      {...props}>
      {categories.map(({ name }, key) => (
        <Typography
          variant={'overline'}
          lineHeight={1}
          fontSize={fontSize}
          key={key}>
          {name}
        </Typography>
      ))}
    </Stack>
  );
}

interface CategoryDisplayProps extends StackProps {
  categories?: DiaryCategory[];
}
