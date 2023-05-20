import type { TypographyOptions } from '@mui/material/styles/createTypography';
import { Calistoga, Mulish } from 'next/font/google';

const calistoga = Calistoga({
  display: 'swap',
  preload: true,
  subsets: ['latin'],
  weight: ['400'],
});

const mulish = Mulish({
  display: 'swap',
  preload: true,
  subsets: ['latin'],
  weight: ['200', '400', '500', '700', '900'],
});

const typography: TypographyOptions = {
  fontFamily: mulish.style.fontFamily,
  h1: {
    fontFamily: calistoga.style.fontFamily,
    fontSize: 72,
    lineHeight: 1.1,
  },
  h2: {
    fontFamily: mulish.style.fontFamily,
    fontWeight: 700,
    lineHeight: 1.1,
  },
};

export default typography;
