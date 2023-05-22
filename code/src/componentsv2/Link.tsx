import type { ButtonProps, LinkProps } from '@mui/material';
import { Button, IconButton, Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';

export default function Link({ children, newTab, ...props }: ZavidLinkProps) {
  const extraProps: LinkProps = newTab
    ? { target: '_blank', rel: 'noopener' }
    : {};
  return (
    <MuiLink
      {...props}
      {...extraProps}
      component={NextLink}
      fontWeight={800}
      underline={'hover'}>
      {children}
    </MuiLink>
  );
}

export function LinkButton({
  children,
  ...props
}: ButtonProps & ZavidLinkProps) {
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

export function LinkIconButton({
  children,
  ...props
}: ButtonProps & ZavidLinkProps) {
  return (
    <IconButton {...props} LinkComponent={Link}>
      {children}
    </IconButton>
  );
}

interface ZavidLinkProps extends LinkProps {
  newTab?: boolean;
}
