import 'styled-components';
import type { ButtonVariant } from 'styles/Variables.styles';

declare module 'styled-components' {
  export interface DefaultTheme {
    backgroundImage: string;
    bodyFontColor: string;
    bodyFontColorReverse: string;
    fadedBorderColor: string;
    fadedFontColor: string;
    fadedFontColorReverse: string;
    hyperlink: string;
    headerBackgroundColor: string;
    footerBackgroundColor: string;
    wishlistItem: string;
    wishlistItemPurchased: string;
    readmore: string;
    readmoreReverse: string;
    button: Record<ButtonVariant?, string>;
  }
}
