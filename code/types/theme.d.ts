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
    Hyperlink: string;
    headerBackgroundColor: string;
    footerBackgroundColor: string;
    Item: {
      Cell: string;
      CellClaimed: string;
      CellPurchased: string;
      ClaimCount: string;
      ClaimCountComplete: string;
      ClaimCountWeight: string;
    };
    readmore: string;
    readmoreReverse: string;
    button: Record<ButtonVariant?, string>;
  }
}
