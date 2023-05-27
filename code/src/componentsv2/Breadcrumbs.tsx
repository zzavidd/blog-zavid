import type { BreadcrumbsProps as MuiBreadcrumbsProps } from '@mui/material';
import { Breadcrumbs as MuiBreadcrumbs, Typography } from '@mui/material';

import { Link } from './Link';

export default function Breadcrumbs({ links, ...props }: BreadcrumbsProps) {
  return (
    <MuiBreadcrumbs {...props}>
      {links.map(({ label, href }) => {
        if (href) {
          return (
            <Link
              href={href}
              underline={'hover'}
              variant={'caption'}
              key={href}>
              {label}
            </Link>
          );
        }

        return (
          <Typography variant={'caption'} fontWeight={700} key={href}>
            {label}
          </Typography>
        );
      })}
    </MuiBreadcrumbs>
  );
}

interface BreadcrumbsProps extends MuiBreadcrumbsProps {
  links: {
    label: string;
    href?: string;
  }[];
}
