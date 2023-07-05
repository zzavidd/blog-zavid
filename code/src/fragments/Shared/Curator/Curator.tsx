import type { SelectChangeEvent } from '@mui/material';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect } from 'react';

import { NextImage } from 'components/Image';
import Paragraph from 'components/Typography/Paragraph';
import { MenuContext } from 'utils/contexts';
import ZString from 'utils/lib/string';
import type { FilterShapeOption, FilterThemeOption } from 'utils/theme';
import { AppTheme, FilterShape, FilterTheme } from 'utils/theme';

import { CuratorContext } from './Curator.context';
import * as Canvas from './Curator.utils';

export default function Curator({ onClose, visible }: CuratorProps) {
  const [menuContext] = useContext(MenuContext);
  const [curatorContext, setCuratorContext] = useContext(CuratorContext);

  const { canvasRef, textRef, curateContent } = Canvas.useCurateContent();

  // Redraw the canvas with new properties.
  useEffect(() => {
    if (!visible) return;

    (async () => {
      const imageSource = await curateContent();
      if (imageSource) {
        setCuratorContext((c) => ({ ...c, imageSource }));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    curatorContext.filterShape,
    curatorContext.filterTheme,
    curatorContext.contentTheme,
    curatorContext.isTitleOnly,
    visible,
  ]);

  /** Download the canvas as an image. */
  async function downloadCanvasAsImage() {
    await Canvas.downloadImage(curatorContext.imageSource);
  }

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

  return (
    <Dialog open={visible} fullWidth={true} maxWidth={'xs'} keepMounted={true}>
      <DialogContent>
        <Stack spacing={2}>
          <Box sx={{ height: (t) => t.spacing(13), width: '100%' }}>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            {curatorContext.imageSource ? (
              <NextImage
                src={curatorContext.imageSource}
                alt={menuContext.info.title}
                loader={() => curatorContext.imageSource}
                data-testid={'zb.curator.image'}
              />
            ) : null}
          </Box>
          <Typography variant={'caption'}>
            Tip: Long-press the image to save to your camera roll.
          </Typography>
          <Divider />
          <Stack spacing={4}>
            <Stack
              direction={'row'}
              justifyContent={'space-between'}
              spacing={4}>
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
              <Paragraph ref={textRef} hidden={true}>
                {menuContext.focusedTextContent}
              </Paragraph>
            </Stack>
            <Stack
              direction={'row'}
              justifyContent={'space-between'}
              spacing={4}>
              <FormControl fullWidth={true}>
                <InputLabel>Colour</InputLabel>
                <Select
                  label={'Colour'}
                  value={curatorContext.filterTheme}
                  onChange={toggleFilterTheme}>
                  {FilterTheme.OPTIONS.map((colour) => (
                    <MenuItem value={colour} key={colour}>
                      {ZString.toTitleCase(colour)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth={true}>
                <InputLabel>Shape</InputLabel>
                <Select
                  label={'Shape'}
                  value={curatorContext.filterShape}
                  onChange={toggleFilterShape}>
                  {FilterShape.OPTIONS.map((shape) => (
                    <MenuItem value={shape} key={shape}>
                      {ZString.toTitleCase(shape)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button variant={'outlined'} onClick={onClose}>
          Cancel
        </Button>
        <Button variant={'contained'} onClick={downloadCanvasAsImage}>
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface CuratorProps {
  visible: boolean;
  onClose: () => void;
}
