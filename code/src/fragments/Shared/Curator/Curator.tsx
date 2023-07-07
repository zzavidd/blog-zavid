import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import html2canvas from 'html2canvas';
import React, { useContext, useEffect, useRef } from 'react';

import { NextImage } from 'components/Image';
import Paragraph from 'components/Typography/Paragraph';
import CategoryDisplay from 'fragments/Pages/Diary/CategoryDisplay';
import { MenuContext } from 'utils/contexts';
import ZDate from 'utils/lib/date';

import { CuratorContext } from './Curator.context';
import { useBackgroundImage } from './Curator.utils';
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
        canvas: existingCanvas,
        height: bgImage.height,
        width: bgImage.width,
      });
      const imageSource = canvas.toDataURL('image/jpeg');
      setCuratorContext((c) => ({ ...c, imageSource }));
    })();
  }, [bgImage, curatorContext.contentTheme, setCuratorContext, visible]);

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
  const textBackgroundColor = isLightTheme
    ? 'rgba(255,255,255,0.75)'
    : 'rgba(0,0,0,0.8)';
  const textColor = isLightTheme ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,1)';

  return (
    <Stack
      sx={{
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundImage: `url(/images/filters/${curatorContext.filterShape}-${curatorContext.filterTheme}.jpg)`,
        height: bgImage?.height,
        width: bgImage?.width,
      }}>
      <Stack
        justifyContent={'center'}
        alignContent={'center'}
        height={'100%'}
        width={'100%'}
        ref={elementRef}>
        <Stack
          bgcolor={textBackgroundColor}
          borderRadius={0.8}
          m={'5rem'}
          p={'2.5rem'}>
          {curatorContext.isTitleOnly ? (
            <React.Fragment>
              <Typography color={textColor} fontSize={28}>
                {ZDate.format(menuContext.info.date)}
              </Typography>
              <Typography
                variant={'h3'}
                color={textColor}
                fontSize={70}
                mt={'0.5rem'}
                mb={'1rem'}>
                {menuContext.info.title}
              </Typography>
              {menuContext.info.categories.length ? (
                <CategoryDisplay
                  color={textColor}
                  fontSize={24}
                  categories={menuContext.info.categories}
                  mt={1}
                />
              ) : null}
            </React.Fragment>
          ) : (
            <Paragraph
              TypographyProps={{
                color: textColor,
                fontSize: 44,
              }}>
              {menuContext.focusedTextContent!}
            </Paragraph>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

interface CuratorProps {
  visible: boolean;
  onClose: () => void;
}

interface PreviewProps {
  elementRef: React.RefObject<HTMLDivElement>;
}
