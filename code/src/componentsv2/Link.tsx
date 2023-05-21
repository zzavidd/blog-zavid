import type { ButtonProps, LinkProps } from '@mui/material';
import { Button, Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';

export default function Link({ children, ...props }: LinkProps) {
  return (
    <MuiLink
      {...props}
      component={NextLink}
      fontWeight={800}
      underline={'hover'}>
      {children}
    </MuiLink>
  );
}

export function LinkButton({ children, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      LinkComponent={Link}
      variant={'outlined'}
      sx={{ padding: (t) => t.spacing(3, 5), width: 'fit-content' }}>
      {children}
    </Button>
  );
}
