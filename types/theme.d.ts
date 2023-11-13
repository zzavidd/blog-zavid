import '@mui/material/styles';
import '@mui/material/Typography';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    preamble: React.CSSProperties;
    text: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    preamble?: React.CSSProperties;
    text?: React.CSSProperties;
  }

  interface Palette {
    card: CardColors;
  }

  interface PaletteOptions {
    card?: CardColors;
  }

  interface ZIndex {
    drawerFooter: number;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    preamble: true;
    text: true;
  }
}

interface CardColors {
  claimed: string;
  default: string;
  purchased: string;
}
