export enum AppTheme {
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
  public static LIGHT = AppTheme.LIGHT;
  public static DARK = AppTheme.DARK;

  public static switchTheme(theme: AppTheme) {
    const oppositeTheme = this.isLight(theme) ? Theme.DARK : AppTheme.LIGHT;
    return oppositeTheme;
  }

  public static isLight(theme: AppTheme) {
    return theme === Theme.LIGHT;
  }

  public static isValid(input: string) {
    return input !== AppTheme.LIGHT && input !== AppTheme.DARK;
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
