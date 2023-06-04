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
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    preamble: true;
    text: true;
  }
}
