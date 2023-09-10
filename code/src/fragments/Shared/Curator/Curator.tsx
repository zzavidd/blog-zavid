import { FavoriteRounded } from '@mui/icons-material';
import type { Theme } from '@mui/material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Stack,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material';
import html2canvas from 'html2canvas';
import immutate from 'immutability-helper';
import React, { useContext, useEffect, useMemo, useRef } from 'react';

import { NextImage } from 'components/Image';
import Paragraph from 'components/Typography/Paragraph';
import CategoryDisplay from 'fragments/Pages/Diary/CategoryDisplay';
import { calistoga } from 'styles/Typography.styles';
import { MenuContext } from 'utils/contexts';
import ZDate from 'utils/lib/date';
import * as zText from 'utils/lib/text';
import { FilterShapeOption } from 'utils/theme';

import { CuratorContext } from './Curator.context';
import { DIMENSIONS, useBackgroundImage } from './Curator.utils';
import CuratorControls from './CuratorControls';

export default function Curator({ onClose, visible }: CuratorProps) {
  const [menuContext] = useContext(MenuContext);
  const [curatorContext, setCuratorContext] = useContext(CuratorContext);

  const bgImage = useBackgroundImage();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  // Redraw the canvas with new properties.
  useEffect(() => {
    (async () => {
      const element = elementRef.current;
      if (!element || !bgImage || !visible) return;

      const existingCanvas = canvasRef.current!;
      const ctx = existingCanvas.getContext('2d')!;
      existingCanvas.width = bgImage.width;
      existingCanvas.height = bgImage.height;
      ctx.drawImage(bgImage, 0, 0, bgImage.width, bgImage.height);

      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 1,
        canvas: existingCanvas,
        height: bgImage.height,
        width: bgImage.width,
      });
      const imageSource = canvas.toDataURL('image/jpeg');
      setCuratorContext((c) => ({ ...c, imageSource }));
    })();
  }, [
    bgImage,
    curatorContext.contentTheme,
    curatorContext.isTitleOnly,
    setCuratorContext,
    visible,
  ]);

  return (
    <Dialog open={visible} fullWidth={true} maxWidth={'xs'} keepMounted={true}>
      <DialogContent>
        <Stack spacing={2}>
          <Box>
            {curatorContext.imageSource ? (
              <NextImage
                src={curatorContext.imageSource}
                alt={menuContext.info.title}
                loader={() => curatorContext.imageSource}
                data-testid={'zb.curator.image'}
                height={bgImage?.height}
                width={bgImage?.width}
              />
            ) : null}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <Preview elementRef={elementRef} />
          </Box>
          <CuratorControls />
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button variant={'outlined'} onClick={onClose}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Preview({ elementRef }: PreviewProps) {
  const [menuContext] = useContext(MenuContext);
  const [curatorContext] = useContext(CuratorContext);
  const bgImage = useBackgroundImage();

  const isLightTheme = curatorContext.contentTheme === 'light';
  const isTallShape = curatorContext.filterShape === FilterShapeOption.TALL;

  const textBackgroundColor = isLightTheme
    ? 'rgba(255,255,255,0.75)'
    : 'rgba(0,0,0,0.8)';
  const textColor = isLightTheme ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,1)';

  const fontSize = useMemo(() => {
    const size = isTallShape ? 48 : 44;
    const textLength = zText.deformatText(
      menuContext.focusedTextContent,
    ).length;
    const textLengthLimit = isTallShape ? 550 : 300;
    const excess = textLength - textLengthLimit;
    if (excess <= 0) return size;
    return size - Math.ceil((excess / 40) * 3);
  }, [isTallShape, menuContext.focusedTextContent]);

  function alterTheme(theme: Theme) {
    return createTheme(
      immutate(theme, {
        palette: { mode: { $set: curatorContext.contentTheme } },
      }),
    );
  }

  const Sizes = DIMENSIONS[curatorContext.filterShape];
  const {
    title,
    date,
    categories = [],
    isFavourite,
    entity,
  } = menuContext.info;
  return (
    <ThemeProvider theme={alterTheme}>
      <Stack
        sx={{
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundImage: `url(/images/filters/${curatorContext.filterShape}-${curatorContext.filterTheme}.jpg)`,
          height: bgImage?.height,
          width: bgImage?.width,
          position: 'fixed',
          left: '100vw',
          top: '100vh',
        }}>
        <Stack
          justifyContent={'center'}
          alignContent={'center'}
          height={'100%'}
          width={'100%'}
          ref={elementRef}>
          <Stack
            bgcolor={textBackgroundColor}
            borderRadius={1}
            m={Sizes.CONTAINER_MARGIN}
            p={Sizes.CONTAINER_PADDING}>
            {curatorContext.isTitleOnly ? (
              <React.Fragment>
                <Typography color={textColor} fontSize={Sizes.FONT_SIZE_DATE}>
                  {ZDate.format(date)}
                </Typography>
                <Typography
                  color={textColor}
                  fontFamily={calistoga.style.fontFamily}
                  fontWeight={{ xs: 500, md: 700 }}
                  lineHeight={1.1}
                  fontSize={Sizes.FONT_SIZE_TITLE}
                  my={Sizes.TITLE_MARGIN_Y}>
                  {title}
                </Typography>
                <CategoryDisplay
                  color={textColor}
                  fontSize={Sizes.FONT_SIZE_CATEGORY}
                  categories={categories}
                  spacing={4}
                  mt={4}
                />
                {isFavourite ? (
                  <Stack
                    direction={'row'}
                    alignItems={'center'}
                    spacing={2}
                    mt={5}>
                    <FavoriteRounded color={'error'} sx={{ fontSize: 40 }} />
                    <Typography
                      variant={'body2'}
                      color={textColor}
                      fontSize={Sizes.FONT_SIZE_CATEGORY}>
                      This {entity} is a personal Zavid favourite.
                    </Typography>
                  </Stack>
                ) : null}
              </React.Fragment>
            ) : (
              <Paragraph
                TypographyProps={{
                  color: textColor,
                  fontSize,
                  lineHeight: isTallShape ? 1.9 : 1.8,
                }}>
                {menuContext.focusedTextContent!}
              </Paragraph>
            )}
          </Stack>
          {curatorContext.isTitleOnly ? null : (
            <Typography
              fontFamily={calistoga.style.fontFamily}
              fontWeight={{ xs: 500, md: 700 }}
              lineHeight={1.2}
              fontSize={Sizes.FONT_SIZE_TITLE_CORNER}
              position={'absolute'}
              maxWidth={(t) => t.spacing(15)}
              top={(t) => t.spacing(6)}
              left={(t) => t.spacing(6)}>
              {title}
            </Typography>
          )}
        </Stack>
      </Stack>
    </ThemeProvider>
  );
}

interface CuratorProps {
  visible: boolean;
  onClose: () => void;
}

interface PreviewProps {
  elementRef: React.RefObject<HTMLDivElement>;
}
