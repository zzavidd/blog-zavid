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
import React, { useContext, useEffect, useRef, useState } from 'react';

import {
  AppTheme,
  FilterShape,
  FilterShapeOption,
  FilterTheme,
  FilterThemeOption,
} from 'classes/theme';
import { Paragraph } from 'components/Text';
import { NextImage } from 'componentsv2/Image';
import Canvas from 'constants/canvas';
import ZString from 'lib/string';
import { MenuContext } from 'utils/contexts';

export default function Curator({ onClose, visible }: CuratorProps) {
  const [state, setState] = useState<CuratorState>({
    contentTheme: AppTheme.DARK,
    filterTheme: FilterThemeOption.PURPLE,
    filterShape: FilterShapeOption.SQUARE,
    imageSource: '',
    isTitleOnly: false,
  });

  const [context] = useContext(MenuContext);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLPreElement>(null);

  // Redraw the canvas with new properties.
  useEffect(() => {
    (async () => {
      const canvas = canvasRef.current;
      const content = textRef.current;
      if (!canvas || !content) return;

      await Canvas.createFromContent(
        canvas,
        content,
        context.title,
        state,
        (imageSource) => setState((s) => ({ ...s, imageSource })),
      );
    })();
  }, [context.title, state, visible]);

  /** Download the canvas as an image. */
  async function downloadCanvasAsImage() {
    await Canvas.downloadImage(state.imageSource);
  }

  /** Toggle the theme of the image content. */
  function toggleContentTheme() {
    const oppositeTheme =
      state.contentTheme === AppTheme.LIGHT ? AppTheme.DARK : AppTheme.LIGHT;
    setState((s) => ({
      ...s,
      contentTheme: oppositeTheme,
    }));
  }

  /** Toggle the filter theme of the image background. */
  function toggleFilterTheme(e: SelectChangeEvent<FilterThemeOption>) {
    setState((s) => ({
      ...s,
      filterTheme: e.target.value,
    }));
  }

  /** Toggle the filter shape of the image. */
  function toggleFilterShape(e: SelectChangeEvent<FilterShapeOption>) {
    setState((s) => ({
      ...s,
      filterShape: e.target.value,
    }));
  }

  /** Toggle whether curation is title only. */
  function toggleTitleOnly(e: React.ChangeEvent<HTMLInputElement>) {
    setState((s) => ({ ...s, isTitleOnly: e.target.checked }));
  }

  return (
    <Dialog open={visible} maxWidth={'sm'}>
      <DialogContent>
        <Box width={'100%'}>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <NextImage src={state.imageSource} alt={context.title} />
        </Box>
        <Stack spacing={2} divider={<Divider />}>
          <Typography variant={'caption'}>
            Tip: Long-press the image to save to your camera roll.
          </Typography>
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
                    checked={state.isTitleOnly}
                    onChange={toggleTitleOnly}
                  />
                }
              />
              <FormControlLabel
                label={'Dark theme?'}
                slotProps={{ typography: { variant: 'body2' } }}
                control={
                  <Checkbox
                    checked={state.contentTheme === AppTheme.DARK}
                    onChange={toggleContentTheme}
                  />
                }
              />
              <Paragraph ref={textRef} hidden>
                {context.focusedTextContent}
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
                  value={state.filterTheme}
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
                  value={state.filterShape}
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
