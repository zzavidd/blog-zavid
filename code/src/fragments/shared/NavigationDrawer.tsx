import {
  AccountCircle,
  Book,
  Cloud,
  HistoryEdu,
  Redeem,
} from '@mui/icons-material';
import {
  Drawer,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import NextImage from 'next/image';
import { useContext } from 'react';

import Link from 'componentsv2/Link';
import Settings from 'constants/settings';
import { NavigationContext } from 'utils/contexts';

const paths: PathDefinition[] = [
  { title: 'Diary', url: '/diary', icon: <Book /> },
  { title: 'Reveries', url: '/reveries', icon: <Cloud /> },
  { title: 'Epistles', url: '/epistles', icon: <HistoryEdu /> },
  // { title: 'Poetry', url: '/poetry' },
  // { title: 'Musings', url: '/musings' },
  { title: 'About', url: '/about', icon: <AccountCircle /> },
  { title: 'Wishlist', url: '/wishlist', icon: <Redeem /> },
];

export function NavigationDrawer() {
  const [isNavOpen, setNavOpen] = useContext(NavigationContext);

  function closeNav() {
    setNavOpen(false);
  }

  return (
    <Drawer
      open={isNavOpen}
      onClose={closeNav}
      anchor={'left'}
      PaperProps={{
        sx: {
          padding: (t) => t.spacing(4),
          width: (t) => t.spacing(12),
        },
      }}>
      <Toolbar />
      <Link href={'/'} color={'text.primary'}>
        <Stack direction={'row'} spacing={3} alignItems={'center'}>
          <NextImage
            src={'static/logos/zavid-head-logo.png'}
            alt={'Zavid Logo'}
            width={50}
            height={50}
          />
          <Typography variant={'subtitle2'} component={'p'}>
            {Settings.SITE_TITLE}: {Settings.SITE_TAGLINE}
          </Typography>
        </Stack>
      </Link>
      <MenuList>
        {paths.map(({ title, url, icon }) => {
          return (
            <Link href={url} color={'text.primary'} key={title}>
              <MenuItem>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    fontFamily: (t) => t.typography.h4.fontFamily,
                    marginBottom: 0,
                    sx: { marginBlock: (t) => t.spacing(1) },
                    variant: 'h4',
                  }}>
                  {title}
                </ListItemText>
              </MenuItem>
            </Link>
          );
        })}
      </MenuList>
    </Drawer>
  );
}

interface PathDefinition {
  title: string;
  url: string;
  icon: React.ReactNode;
  isNew?: boolean;
}
