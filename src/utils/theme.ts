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

  public static isTall(shape: FilterShapeOption): boolean {
    return shape === FilterShapeOption.TALL;
  }
}
