import type {
  LinkProps,
  BreadcrumbsProps as MuiBreadcrumbsProps,
} from '@mui/material';
import { Breadcrumbs as MuiBreadcrumbs, Typography } from '@mui/material';

import { Link } from './Link';

export default function Breadcrumbs({ links, ...props }: BreadcrumbsProps) {
  const linkProps: LinkProps = {
    variant: 'caption',
    fontSize: { xs: 11, md: 12 },
    fontWeight: 800,
    lineHeight: 1,
  };
  return (
    <MuiBreadcrumbs
      separator={
        <Typography variant={'caption'} mt={1}>
          /
        </Typography>
      }
      sx={{ lineHeight: 0.2 }}
      {...props}>
      {links.map(({ label, href }, key) => {
        if (href) {
          return (
            <Link href={href} underline={'hover'} {...linkProps} key={key}>
              {label}
            </Link>
          );
        }

        return (
          <Typography {...linkProps} key={key}>
            {label}
          </Typography>
        );
      })}
    </MuiBreadcrumbs>
  );
}

export interface BreadcrumbLink {
  label: string;
  href?: string;
}

interface BreadcrumbsProps extends MuiBreadcrumbsProps {
  links: BreadcrumbLink[];
}
