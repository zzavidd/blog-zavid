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
