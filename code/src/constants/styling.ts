import type { DefaultTheme } from 'styled-components';

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

  BUTTON: {
    [ButtonVariant.CONFIRM]: '#391144',
    [ButtonVariant.CANCEL]: '#8e74ab',
    [ButtonVariant.DELETE]: '#c80000',
    [ButtonVariant.ADMIN]: '#cecece',
  } as Record<ButtonVariant, string>,
};

export const FONTS = {
  TITLE: "'Calistoga', 'cursive'",
  BODY: "'Mulish', sans-serif",
};

export const THEME: Record<'light' | 'dark', DefaultTheme> = {
  light: {
    backgroundImage:
      'https://res.cloudinary.com/zavid/image/upload/v1606588947/static/bg/bg-app-light',
    bodyFontColor: COLOR.BLACK,
  },
  dark: {
    backgroundImage:
      'https://res.cloudinary.com/zavid/image/upload/v1597608184/static/bg/bg-app-dark',
    bodyFontColor: COLOR.WHITE,
  },
};
