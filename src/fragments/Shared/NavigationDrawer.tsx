import type { SvgIconComponent } from '@mui/icons-material';
import {
  AccountCircleRounded,
  BookRounded,
  Email as EmailIcon,
  RedeemRounded,
} from '@mui/icons-material';
import {
  Divider,
  Drawer,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Stack,
  Typography,
} from '@mui/material';
import NextImage from 'next/image';
import { useContext } from 'react';

import { Link } from 'components/Link';
import { NavigationContext } from 'utils/contexts';
import Settings from 'utils/settings';

import { ShadowHeader } from './Header';

const pathDefinitions: PathDefinition[][] = [
  [
    { title: 'Diary', url: '/diary', Icon: BookRounded },
    // { title: 'Reveries', url: '/reveries', icon: <CloudRounded /> },
    // { title: 'Epistles', url: '/epistles', icon: <HistoryEduRounded /> },
    // { title: 'Poetry', url: '/poetry' },
    // { title: 'Musings', url: '/musings' },
  ],
  [
    { title: 'Wishlist', url: '/wishlist', Icon: RedeemRounded },
    { title: 'Subscribe', url: '/subscribe', Icon: EmailIcon },
    { title: 'About', url: '/about', Icon: AccountCircleRounded },
  ],
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
      <ShadowHeader />
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
      <Stack divider={<Divider />}>
        {pathDefinitions.map((paths, key) => (
          <MenuList key={key}>
            {paths.map(({ title, url, Icon }) => (
              <Link href={url} color={'text.primary'} key={title}>
                <MenuItem onClick={closeNav} sx={{ py: 2 }}>
                  <ListItemIcon>
                    <Icon color={'primary'} />
                  </ListItemIcon>
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
            ))}
          </MenuList>
        ))}
      </Stack>
    </Drawer>
  );
}

interface PathDefinition {
  title: string;
  url: string;
  isNew?: boolean;
  Icon: SvgIconComponent;
}
