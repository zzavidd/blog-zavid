import {
  AccountCircleRounded,
  BookRounded,
  CloudRounded,
  HistoryEduRounded,
  RedeemRounded,
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
  { title: 'Diary', url: '/diary', icon: <BookRounded /> },
  { title: 'Reveries', url: '/reveries', icon: <CloudRounded /> },
  { title: 'Epistles', url: '/epistles', icon: <HistoryEduRounded /> },
  // { title: 'Poetry', url: '/poetry' },
  // { title: 'Musings', url: '/musings' },
  { title: 'About', url: '/about', icon: <AccountCircleRounded /> },
  { title: 'Wishlist', url: '/wishlist', icon: <RedeemRounded /> },
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
      SlideProps={{ timeout: 150 }}
      PaperProps={{
        sx: {
          padding: (t) => t.spacing(4),
          width: (t) => t.spacing(12),
        },
      }}>
      <Toolbar />
      <Link href={'/'} color={'text.primary'} onClick={closeNav}>
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
              <MenuItem onClick={closeNav}>
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
