import type { SelectChangeEvent, SxProps } from '@mui/material';
import {
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import React, { useContext } from 'react';

import ZString from 'utils/lib/string';
import type { FilterShapeOption, FilterThemeOption } from 'utils/theme';
import { AppTheme, FilterShape, FilterTheme } from 'utils/theme';

import { CuratorContext } from './Curator.context';

export default function CuratorControls() {
  const [curatorContext, setCuratorContext] = useContext(CuratorContext);

  /** Toggle the theme of the image content. */
  function toggleContentTheme() {
    const oppositeTheme =
      curatorContext.contentTheme === AppTheme.LIGHT
        ? AppTheme.DARK
        : AppTheme.LIGHT;
    setCuratorContext((c) => ({
      ...c,
      contentTheme: oppositeTheme,
    }));
  }

  /** Toggle the filter theme of the image background. */
  function toggleFilterTheme(e: SelectChangeEvent<FilterThemeOption>) {
    setCuratorContext((c) => ({
      ...c,
      filterTheme: e.target.value as FilterThemeOption,
    }));
  }

  /** Toggle the filter shape of the image. */
  function toggleFilterShape(e: SelectChangeEvent<FilterShapeOption>) {
    setCuratorContext((c) => ({
      ...c,
      filterShape: e.target.value as FilterShapeOption,
    }));
  }

  /** Toggle whether curation is title only. */
  function toggleTitleOnly(e: React.ChangeEvent<HTMLInputElement>) {
    setCuratorContext((c) => ({ ...c, isTitleOnly: e.target.checked }));
  }

  const selectSxProps: SxProps = { sx: { fontSize: 16 } };
  const menuItemSxProps: SxProps = { sx: { fontSize: 16, py: 4 } };

  return (
    <React.Fragment>
      <Typography variant={'caption'}>
        Tip: Long-press the image to save to your camera roll.
      </Typography>
      <Divider />
      <Stack spacing={4}>
        <Stack direction={'row'} justifyContent={'space-between'} spacing={4}>
          <FormControlLabel
            label={'Curate title only'}
            slotProps={{ typography: { variant: 'body2' } }}
            control={
              <Checkbox
                checked={curatorContext.isTitleOnly}
                onChange={toggleTitleOnly}
              />
            }
          />
          <FormControlLabel
            label={'Dark theme?'}
            slotProps={{ typography: { variant: 'body2' } }}
            control={
              <Checkbox
                checked={curatorContext.contentTheme === AppTheme.DARK}
                onChange={toggleContentTheme}
              />
            }
          />
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'} spacing={4}>
          <FormControl fullWidth={true}>
            <InputLabel {...selectSxProps}>Colour</InputLabel>
            <Select
              label={'Colour'}
              value={curatorContext.filterTheme}
              onChange={toggleFilterTheme}
              {...selectSxProps}>
              {FilterTheme.OPTIONS.map((colour) => (
                <MenuItem {...menuItemSxProps} value={colour} key={colour}>
                  {ZString.toTitleCase(colour)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth={true}>
            <InputLabel {...selectSxProps}>Shape</InputLabel>
            <Select
              label={'Shape'}
              value={curatorContext.filterShape}
              onChange={toggleFilterShape}
              {...selectSxProps}>
              {FilterShape.OPTIONS.map((shape) => (
                <MenuItem {...menuItemSxProps} value={shape} key={shape}>
                  {ZString.toTitleCase(shape)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>
    </React.Fragment>
  );
}
