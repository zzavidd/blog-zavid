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
  CONFIRM = 'Confirm',
  CANCEL = 'Cancel',
  DELETE = 'Delete',
  ADMIN = 'Admin',
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

export const SIZES = {
  HEADER_HEIGHT: '40px',
  MIN_NAV_WIDTH: '70px',
  MAX_NAV_WIDTH: '250px',
};

const Font = {
  Title: "'Calistoga', 'cursive'",
  Body: "'Mulish', sans-serif",
};

export const THEME: Record<AppTheme, DefaultTheme> = {
  light: {
    Color: {
      Background: {
        Header: '#dddddd',
        Footer: '#dfdfdf',
        Modal: '#dfdfdf',
      },
      Border: {
        Faded: '#5a5a5a',
      },
      Font: {
        Body: COLOR.BLACK,
        BodyReverse: COLOR.WHITE,
        Faded: '#3e3e3e',
        FadedReverse: '#d4d4d4',
        Readmore: '#005dec',
        ReadmoreReverse: '#87ceeb',
      },
      Button: {
        [ButtonVariant.CONFIRM]: '#643671',
        [ButtonVariant.CANCEL]: '#8e74ab',
        [ButtonVariant.DELETE]: '#c80000',
        [ButtonVariant.ADMIN]: '#cecece',
      },
      Hyperlink: '#aa00ff',
      Item: {
        Cell: '#ccabe5',
        CellPurchased: '#5f5567',
        CellClaimed: '#b1c3f7',
        ClaimCount: '#fff35a',
        ClaimCountComplete: '#007c00',
        ClaimCountWeight: 'bold',
      },
    },
    Font,
    Image: {
      Background: `${Settings.CLOUDINARY_BASE_URL}/v1606588947/static/bg/bg-app-light`,
    },
  },
  dark: {
    Color: {
      Background: {
        Header: '#202020',
        Footer: '#111111',
        Modal: 'rgba(0, 0, 0, 0.6)',
      },
      Border: {
        Faded: '#5a5a5a',
      },
      Button: {
        [ButtonVariant.CONFIRM]: '#391144',
        [ButtonVariant.CANCEL]: '#8e74ab',
        [ButtonVariant.DELETE]: '#c80000',
        [ButtonVariant.ADMIN]: '#cecece',
      },
      Font: {
        Body: COLOR.WHITE,
        BodyReverse: COLOR.BLACK,
        Faded: '#d4d4d4',
        FadedReverse: '#3e3e3e',
        Readmore: '#87ceeb',
        ReadmoreReverse: '#005dec',
      },
      Hyperlink: '#d98dff',
      Item: {
        Cell: '#402e4e',
        CellPurchased: '#7b7b7b',
        CellClaimed: '#5f5e82',
        ClaimCount: '#ffff8d',
        ClaimCountComplete: '#00ff00',
        ClaimCountWeight: 'normal',
      },
    },
    Font,
    Image: {
      Background: `${Settings.CLOUDINARY_BASE_URL}/v1597608184/static/bg/bg-app-dark`,
    },
  },
};
