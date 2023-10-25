import CheckIcon from '@mui/icons-material/Check';
import type { SelectChangeEvent } from '@mui/material';
import {
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
} from '@mui/material';
import ImmutabilityHelper from 'immutability-helper';
import React from 'react';

import { WishlistPageContext } from 'utils/contexts';

const NONE_ID = '0';

export default function CategoryField() {
  const [context, setContext] = React.useContext(WishlistPageContext);
  const { categoryId } = context.wishlistItemRequest;

  const categories = useCategoryOptions();
  const categoriesById = useCategoriesById();

  function onCategorySelect(e: SelectChangeEvent) {
    const { value } = e.target;
    const categoryId = value ? parseInt(value) : null;
    setContext((current) =>
      ImmutabilityHelper(current, {
        wishlistItemRequest: { categoryId: { $set: categoryId } },
      }),
    );
  }

  function renderValue(value: string) {
    return categoriesById.get(String(value)) || 'None';
  }

  return (
    <FormControl>
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
  const [context] = React.useContext(WishlistPageContext);
  const options = Object.entries(context.categories)
    .map(([id, { name }]) => ({
      label: name,
      value: String(id),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
  return [{ label: 'None', value: NONE_ID }, ...options];
}

function useCategoriesById(): Map<string, string> {
  const [context] = React.useContext(WishlistPageContext);
  const categories = new Map();
  categories.set('', 'None');
  Object.entries(context.categories).forEach(([id, { name }]) => {
    categories.set(id, name);
  });
  return categories;
}
