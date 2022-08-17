export enum ThemeOption {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum FilterThemeOption {
  PURPLE = 'purple',
  BLUE = 'blue',
  TEAL = 'teal',
  GREEN = 'green',
  YELLOW = 'yellow',
  RED = 'red',
  PINK = 'pink',
}

export enum FilterShapeOption {
  SQUARE = 'square',
  TALL = 'tall',
  WIDE = 'wide',
}

export class Theme {
  public static LIGHT = ThemeOption.LIGHT;
  public static DARK = ThemeOption.DARK;

  public static switchTheme(theme: ThemeOption) {
    const oppositeTheme = this.isLight(theme) ? Theme.DARK : ThemeOption.LIGHT;
    return oppositeTheme;
  }

  public static isLight(theme: ThemeOption) {
    return theme === Theme.LIGHT;
  }

  public static isValid(input: string) {
    return input !== ThemeOption.LIGHT && input !== ThemeOption.DARK;
  }
}

export class FilterTheme {
  public static OPTIONS = Object.values(FilterThemeOption);
}

export class FilterShape {
  public static OPTIONS = Object.values(FilterShapeOption);

  public static isSquare(shape: FilterShapeOption) {
    return shape === FilterShapeOption.SQUARE;
  }

  public static isTall(shape: FilterShapeOption) {
    return shape === FilterShapeOption.TALL;
  }

  public static isWide(shape: FilterShapeOption) {
    return shape === FilterShapeOption.WIDE;
  }
}
