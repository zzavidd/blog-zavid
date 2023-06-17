import { createTheme } from '@mui/material';
import type { TypographyOptions } from '@mui/material/styles/createTypography';
import { Calistoga, Mulish } from 'next/font/google';

const { breakpoints } = createTheme();

export const calistoga = Calistoga({
  display: 'swap',
  preload: true,
  subsets: ['latin'],
  weight: ['400'],
});

export const mulish = Mulish({
  display: 'swap',
  preload: true,
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['200', '400', '500', '700', '800', '900'],
});

const typography: TypographyOptions = {
  fontFamily: mulish.style.fontFamily,
  h1: {
    fontFamily: calistoga.style.fontFamily,
    fontSize: 72,
    lineHeight: 1.1,
    [breakpoints.down('md')]: {
      fontSize: 44,
    },
  },
  h2: {
    fontFamily: calistoga.style.fontFamily,
    fontSize: 40,
    fontWeight: 700,
    lineHeight: 1.1,
    [breakpoints.down('md')]: {
      fontSize: 30,
      letterSpacing: -2,
    },
  },
  h3: {
    fontFamily: calistoga.style.fontFamily,
    fontSize: 30,
    fontWeight: 700,
    lineHeight: 1.1,
    [breakpoints.down('md')]: {
      fontSize: 28,
      letterSpacing: -1.5,
    },
  },
  h4: {
    fontFamily: calistoga.style.fontFamily,
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  h5: {
    fontFamily: mulish.style.fontFamily,
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  h6: {
    fontFamily: calistoga.style.fontFamily,
    fontSize: 18,
    fontWeight: 600,
  },
  subtitle2: {
    fontFamily: calistoga.style.fontFamily,
    fontWeight: 700,
    [breakpoints.down('md')]: {
      letterSpacing: -1,
    },
  },
  body1: {
    fontFamily: mulish.style.fontFamily,
    fontSize: 19,
    lineHeight: 1.6,
    fontWeight: 500,
  },
  body2: {
    fontFamily: mulish.style.fontFamily,
    fontSize: 14,
  },
  button: {
    fontWeight: 700,
  },
  overline: {},
  preamble: {
    fontFamily: mulish.style.fontFamily,
    fontSize: 16,
    lineHeight: 1.6,
    fontWeight: 500,
  },
  text: {
    fontFamily: mulish.style.fontFamily,
    fontSize: 19,
    lineHeight: 1.9,
    fontWeight: 500,
    [breakpoints.down('md')]: {
      fontSize: 16.5,
    },
  },
};

export default typography;
