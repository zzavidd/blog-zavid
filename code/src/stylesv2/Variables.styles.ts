import type { DefaultTheme } from 'styled-components';

import type { AppTheme } from 'classes/theme';
import { CLOUDINARY_BASE_URL } from 'constants/settings';
import type { AlertType } from 'constants/types';

export enum Breakpoint {
  SMALL = 'sm',
  MEDIUM = 'md',
  LARGE = 'lg',
  XLARGE = 'xl',
  XXLARGE = 'xxl',
  XXXLARGE = 'xxxl',
}

export const BREAKPOINTS = {
  [Breakpoint.SMALL]: '576px',
  [Breakpoint.MEDIUM]: '768px',
  [Breakpoint.LARGE]: '992px',
  [Breakpoint.XLARGE]: '1200px',
  [Breakpoint.XXLARGE]: '1440px',
  [Breakpoint.XXXLARGE]: '1600px',
};

export enum ButtonVariant {
  CONFIRM = 'confirm',
  CANCEL = 'cancel',
  DELETE = 'delete',
  ADMIN = 'admin',
}

export const COLOR = {
  WHITE: '#ffffff',
  BLACK: '#000000',

  MODAL: '#202020',
  ALERT: {
    success: '#c3ffc3',
    error: '#ffa2a2',
  } as Record<AlertType, string>,
};

export const FONTS = {
  TITLE: "'Calistoga', 'cursive'",
  BODY: "'Mulish', sans-serif",
};

export const SIZES = {
  HEADER_HEIGHT: '70px',
};

export const THEME: Record<AppTheme, DefaultTheme> = {
  light: {
    backgroundImage: `${CLOUDINARY_BASE_URL}/v1606588947/static/bg/bg-app-light`,
    bodyFontColor: COLOR.BLACK,
    bodyFontColorReverse: COLOR.WHITE,
    fadedFontColor: '#3e3e3e',
    hyperlink: '#aa00ff',
    headerBackgroundColor: '#dddddd',
    footerBackgroundColor: '#dfdfdf',
    readmore: '#005dec',
    button: {
      [ButtonVariant.CONFIRM]: '#643671',
      [ButtonVariant.CANCEL]: '#8e74ab',
      [ButtonVariant.DELETE]: '#c80000',
      [ButtonVariant.ADMIN]: '#cecece',
    },
  },
  dark: {
    backgroundImage: `${CLOUDINARY_BASE_URL}/v1597608184/static/bg/bg-app-dark`,
    bodyFontColor: COLOR.WHITE,
    bodyFontColorReverse: COLOR.BLACK,
    fadedFontColor: '#d4d4d4',
    hyperlink: '#d98dff',
    headerBackgroundColor: '#202020',
    footerBackgroundColor: '#111111',
    readmore: '#87ceeb',
    button: {
      [ButtonVariant.CONFIRM]: '#391144',
      [ButtonVariant.CANCEL]: '#8e74ab',
      [ButtonVariant.DELETE]: '#c80000',
      [ButtonVariant.ADMIN]: '#cecece',
    },
  },
};
