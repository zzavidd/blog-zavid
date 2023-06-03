import '@mui/material/styles';
import '@mui/material/Typography';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    text: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    text?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    text: true;
  }
}
