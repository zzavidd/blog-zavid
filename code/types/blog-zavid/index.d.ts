import 'styled-components';
import type { ButtonVariant } from 'stylesv2/Variables.styles';

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
    readmore: string;
    readmoreReverse: string;
    button: Record<ButtonVariant?, string>;
  }
}

declare global {
  interface String {
    standardize(): string;
  }
}

declare class Stringified<T> extends String {
  private ___stringified: T;
}

interface JSON {
  stringify<T>(
    value: T,
    replacer?: (key: string, value: any) => any,
    space?: string | number,
  ): string & Stringified<T>;
  parse<T>(text: Stringified<T>, reviver?: (key: any, value: any) => any): T;
  parse(text: string, reviver?: (key: any, value: any) => any): any;
}
