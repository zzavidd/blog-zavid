import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    backgroundImage: string;
    bodyFontColor: string;
    hyperlink: string;
    readmore: string;
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
