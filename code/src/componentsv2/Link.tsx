import type { LinkProps } from '@mui/material';
import { Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';

export default function Link({ children, ...props }: LinkProps) {
  return (
    <MuiLink {...props} component={NextLink}>
      {children}
    </MuiLink>
  );
}
