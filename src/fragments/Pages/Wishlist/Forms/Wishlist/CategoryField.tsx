import CheckIcon from '@mui/icons-material/Check';
import {
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import immutate from 'immutability-helper';
import { useContext } from 'react';

import { WishlistContext } from '../../WishlistContext';

const NONE_ID = '0';

export default function CategoryField() {
  const [context, setContext] = useContext(WishlistContext);
  const { categoryId } = context.wishlistItemRequest;

  const categories = useCategoryOptions();

  function onCategorySelect(e: SelectChangeEvent) {
    const { value } = e.target;
    const categoryId = value ? parseInt(value) : null;
    setContext((current) =>
      immutate(current, {
        wishlistItemRequest: { categoryId: { $set: categoryId } },
      }),
    );
  }

  function renderValue(val: string) {
    return categories.find(({ value }) => value === val)?.label;
  }

  return (
    <FormControl sx={{ flex: 1 }}>
      <InputLabel shrink={true}>Category:</InputLabel>
      <Select
        name={'categoryId'}
        label={'Category:'}
        value={String(categoryId || NONE_ID)}
        onChange={onCategorySelect}
        renderValue={renderValue}
        sx={{ flex: 1 }}>
        {categories.map(({ label, value }) => {
          const isNone = !categoryId && value === NONE_ID;
          const selected = isNone || value === String(categoryId);
          return (
            <MenuItem value={value} key={label}>
              <ListItemIcon>{selected ? <CheckIcon /> : null}</ListItemIcon>
              <ListItemText>{label}</ListItemText>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

function useCategoryOptions(): { label: string; value: string }[] {
  const [context] = useContext(WishlistContext);
  const options = Object.values(context.categories)
    .map(({ id, name }) => ({
      label: name,
      value: String(id),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
  return [{ label: 'None', value: NONE_ID }, ...options];
}
