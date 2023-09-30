import {
  Box,
  CircularProgress,
  CssBaseline,
  Fade,
  Stack,
  ThemeProvider,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useEffect, useRef, useState } from 'react';

import {
  CVDarkTheme,
  CVLightTheme,
} from 'fragments/Resources/CurriculumVitae/CurriculumVitae.styles';
import {
  CV_HEIGHT,
  CV_WIDTH,
} from 'fragments/Resources/CurriculumVitae/CurriculumVitae.utils';
import CVMain from 'fragments/Resources/CurriculumVitae/Sections/CVMain';
import CVProfile from 'fragments/Resources/CurriculumVitae/Sections/CVProfile';

export default function CurriculumVitae() {
  const [state, setState] = useState({ url: '' });
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('lg'));

  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matches || state.url) return;

    (async () => {
      const element = elementRef.current;
      if (!element) return;

      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 3,
        height: CV_HEIGHT,
        width: CV_WIDTH,
      });
      const imageSource = canvas.toDataURL('image/png');
      const pdf = new jsPDF('portrait', 'px', [CV_WIDTH, CV_HEIGHT]);
      pdf.addImage(imageSource, 'PNG', 0, 0, CV_WIDTH, CV_HEIGHT, '', 'FAST');
      const url = pdf.output('bloburl');
      setState({ url: String(url) });
    })();
  }, [matches, state.url]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Box display={{ xs: 'none', lg: 'block' }}>
        {state.url ? (
          <Fade in={!!state.url}>
            <iframe
              src={state.url}
              style={{ height: '100vh', width: '100%' }}
              allow={'fullscreen'}
            />
          </Fade>
        ) : (
          <Fade in={!state.url}>
            <Stack
              height={'100vh'}
              width={'100%'}
              justifyContent={'center'}
              alignItems={'center'}
              spacing={2}>
              <CircularProgress />
              <Box>
                <Typography textAlign={'center'}>
                  Loading Zavid&apos;s
                </Typography>
                <Typography>Curriculum Vitae...</Typography>
              </Box>
            </Stack>
          </Fade>
        )}
      </Box>
      <Stack
        direction={'row'}
        position={{ xs: 'relative', lg: 'fixed' }}
        zIndex={{ xs: 1, lg: -1 }}
        height={CV_HEIGHT}
        width={CV_WIDTH}
        ref={elementRef}>
        <ThemeProvider theme={CVDarkTheme}>
          <CssBaseline />
          <CVProfile />
        </ThemeProvider>
        <ThemeProvider theme={CVLightTheme}>
          <CVMain />
        </ThemeProvider>
      </Stack>
    </Box>
  );
}
