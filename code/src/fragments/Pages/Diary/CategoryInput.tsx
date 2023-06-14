import type {
  BaseTextFieldProps,
  OutlinedInputProps,
  SelectChangeEvent,
  SelectProps,
} from '@mui/material';
import { Chip, MenuItem, Stack, TextField, Typography } from '@mui/material';

import { useDiaryCategories } from 'utils/hooks';

export default function CategoryInput({
  value,
  onChange,
  ...props
}: CategoryInputProps) {
  const { data: diaryCategories = [] } = useDiaryCategories();
  return (
    <TextField
      value={value}
      label={'Categories'}
      select={true}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      SelectProps={
        {
          displayEmpty: false,
          IconComponent: () => null,
          multiple: true,
          onChange,
          renderValue: (selected) => (
            <Stack
              direction={'row'}
              flexWrap={'wrap'}
              spacing={2}
              useFlexGap={true}>
              {selected.map((categoryId) => {
                const name = diaryCategories.find(
                  ({ id }) => id === categoryId,
                )?.name;
                return (
                  <Chip
                    variant={'outlined'}
                    label={<Typography variant={'overline'}>{name}</Typography>}
                    key={categoryId}
                  />
                );
              })}
            </Stack>
          ),
          sx: {
            py: 1,
          },
        } as Partial<SelectProps<number[]>>
      }
      {...props}>
      {diaryCategories.map((category) => (
        <MenuItem value={category.id} key={category.id}>
          {category.name}
        </MenuItem>
      ))}
    </TextField>
  );
}

interface CategoryInputProps extends BaseTextFieldProps {
  value: number[];
  onChange: (e: SelectChangeEvent<number[]>) => void;
  InputProps?: Partial<OutlinedInputProps>;
}
