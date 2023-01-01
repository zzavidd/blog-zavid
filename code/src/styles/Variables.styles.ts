import type { DefaultTheme } from 'styled-components';

import type { AppTheme } from 'classes/theme';
import Settings from 'constants/settings';

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
  HEADER_HEIGHT: '40px',
  MIN_NAV_WIDTH: '70px',
  MAX_NAV_WIDTH: '250px',
};

export const THEME: Record<AppTheme, DefaultTheme> = {
  light: {
    backgroundImage: `${Settings.CLOUDINARY_BASE_URL}/v1606588947/static/bg/bg-app-light`,
    bodyFontColor: COLOR.BLACK,
    bodyFontColorReverse: COLOR.WHITE,
    fadedBorderColor: '#5a5a5a',
    fadedFontColor: '#3e3e3e',
    fadedFontColorReverse: '#d4d4d4',
    Hyperlink: '#aa00ff',
    headerBackgroundColor: '#dddddd',
    footerBackgroundColor: '#dfdfdf',
    Item: {
      Cell: '#ccabe5',
      CellPurchased: '#5f5567',
      CellClaimed: '#b1c3f7',
      ClaimCount: '#fff35a',
      ClaimCountComplete: '#007c00',
      ClaimCountWeight: 'bold',
    },
    readmore: '#005dec',
    readmoreReverse: '#87ceeb',
    button: {
      [ButtonVariant.CONFIRM]: '#643671',
      [ButtonVariant.CANCEL]: '#8e74ab',
      [ButtonVariant.DELETE]: '#c80000',
      [ButtonVariant.ADMIN]: '#cecece',
    },
  },
  dark: {
    backgroundImage: `${Settings.CLOUDINARY_BASE_URL}/v1597608184/static/bg/bg-app-dark`,
    bodyFontColor: COLOR.WHITE,
    bodyFontColorReverse: COLOR.BLACK,
    fadedBorderColor: '#5a5a5a',
    fadedFontColor: '#d4d4d4',
    fadedFontColorReverse: '#3e3e3e',
    Hyperlink: '#d98dff',
    headerBackgroundColor: '#202020',
    footerBackgroundColor: '#111111',
    Item: {
      Cell: '#402e4e',
      CellPurchased: '#7b7b7b',
      CellClaimed: '#5f5e82',
      ClaimCount: '#ffff8d',
      ClaimCountComplete: '#00ff00',
      ClaimCountWeight: 'normal',
    },
    readmore: '#87ceeb',
    readmoreReverse: '#005dec',
    button: {
      [ButtonVariant.CONFIRM]: '#391144',
      [ButtonVariant.CANCEL]: '#8e74ab',
      [ButtonVariant.DELETE]: '#c80000',
      [ButtonVariant.ADMIN]: '#cecece',
    },
  },
};
