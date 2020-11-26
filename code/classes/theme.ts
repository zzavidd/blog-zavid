export enum ThemeOption {
  LIGHT = 'light',
  DARK = 'dark'
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
