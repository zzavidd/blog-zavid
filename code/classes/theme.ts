export enum ThemeOption {
  LIGHT = 'light',
  DARK = 'dark'
}

export enum FilterThemeOption {
  PURPLE = 'purple',
  BLUE = 'blue',
  TEAL = 'teal',
  GREEN = 'green',
  YELLOW = 'yellow',
  RED = 'red',
  PINK = 'pink'
}

export enum FilterShapeOption {
  SQUARE = 'square',
  TALL = 'tall',
  WIDE = 'wide'
}

export class Theme {
  static LIGHT = ThemeOption.LIGHT;
  static DARK = ThemeOption.DARK;

  static switchTheme(theme: ThemeOption) {
    const oppositeTheme = this.isLight(theme) ? Theme.DARK : ThemeOption.LIGHT;
    return oppositeTheme;
  }

  static isLight(theme: ThemeOption) {
    return theme === Theme.LIGHT;
  }

  static isValid(input: string) {
    return input !== ThemeOption.LIGHT && input !== ThemeOption.DARK;
  }
}

export class FilterTheme {
  static OPTIONS = Object.values(FilterThemeOption);
}

export class FilterShape {
  static OPTIONS = Object.values(FilterShapeOption);

  static isSquare(shape: FilterShapeOption) {
    return shape === FilterShapeOption.SQUARE;
  }

  static isTall(shape: FilterShapeOption) {
    return shape === FilterShapeOption.TALL;
  }

  static isWide(shape: FilterShapeOption) {
    return shape === FilterShapeOption.WIDE;
  }
}
