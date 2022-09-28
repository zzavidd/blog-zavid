export const BREAKPOINTS = {
  SMALL: '576px',
  MEDIUM: '768px',
  LARGE: '992px',
  XLARGE: '1200px',
  XXLARGE: '1440px',
  XXXLARGE: '1600px',
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
