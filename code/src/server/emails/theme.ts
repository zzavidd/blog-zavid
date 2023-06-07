export const TITLE_FONTS = ['Calistoga', 'Optima'];
export const BODY_FONTS = ['Mulish', 'Helvetica', 'Roboto'];

const EmailTheme = {
  Color: {
    Light: {
      Primary: '#dfdfdf',
      Secondary: '#eeeeee',
      Body: '#f7f7f7',
      Hyperlink: '#7e14ff',
      Button: '#383838',
      ButtonText: '#ffffff',
      Text: '#000000',
    },
    Dark: {
      Primary: '#111111',
      Secondary: '#202020',
      Body: '#202020',
      Hyperlink: 'hsl(268, 100%, 76%)',
      Button: '#383838',
      ButtonText: '#ffffff',
      Text: '#ffffff',
    },
  },
  Font: {
    Title: TITLE_FONTS.join(', '),
    Body: BODY_FONTS.join(', '),
  },
};

export default EmailTheme;
