import type { TypographyOptions } from '@mui/material/styles/createTypography';
import { Calistoga, Mulish } from 'next/font/google';

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
  },
  h2: {
    fontFamily: calistoga.style.fontFamily,
    fontSize: 40,
    fontWeight: 700,
    lineHeight: 1.1,
  },
  h3: {
    fontFamily: calistoga.style.fontFamily,
    fontSize: 32,
    fontWeight: 700,
    lineHeight: 1.1,
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
    fontSize: 17,
    lineHeight: 1.9,
    fontWeight: 500,
  },
};

export default typography;
