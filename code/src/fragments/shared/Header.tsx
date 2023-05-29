import {
  DarkMode,
  LightModeOutlined as LightModeOutlinedIcon,
  Lock as LockIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import type { SxProps, Theme } from '@mui/material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useContext, useRef, useState } from 'react';

import { AppActions, useAppDispatch, useAppSelector } from 'constants/reducers';
import { NavigationContext } from 'utils/contexts';
import { useIsAdmin } from 'utils/hooks';

export default function Header() {
  const [isNavOpen, setNavOpen] = useContext(NavigationContext);
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.local.theme);
  const isLightTheme = currentTheme === 'light';

  function openNav() {
    setNavOpen(!isNavOpen);
  }

  function toggleTheme() {
    const theme = isLightTheme ? 'dark' : 'light';
    dispatch(AppActions.setAppTheme(theme));
  }

  return (
    <AppBar
      position={'sticky'}
      sx={{
        paddingInline: (t) => t.spacing(2),
        zIndex: (t) => t.zIndex.drawer + 1,
      }}>
      <Toolbar>
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          width={'100%'}>
          <Box>
            <IconButton onClick={openNav} size={'large'} edge={'start'}>
              <MenuIcon />
            </IconButton>
          </Box>
          <Stack direction={'row'} spacing={2} alignItems={'center'}>
            <Box>
              {isLightTheme ? (
                <Tooltip title={'Switch to dark mode'}>
                  <IconButton onClick={toggleTheme} size={'large'}>
                    <LightModeOutlinedIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title={'Switch to light mode'}>
                  <IconButton onClick={toggleTheme} size={'large'}>
                    <DarkMode color={'secondary'} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <AuthButton />
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

function AuthButton() {
  const [state, setState] = useState({ isMenuOpen: false });
  const avatarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const session = useSession();
  const user = session.data?.user;
  const isAdmin = useIsAdmin();

  function openMenu() {
    setState({ isMenuOpen: true });
  }

  function onMenuClose() {
    setState({ isMenuOpen: false });
  }

  function navigateToAdminConsole() {
    void router.push('/admin');
  }

  if (!user) {
    return (
      <Button
        variant={'outlined'}
        color={'secondary'}
        startIcon={<LoginIcon />}
        onClick={() => signIn('google')}>
        Sign In
      </Button>
    );
  }

  const initials = user.name
    ? user.name.split(/\s/).reduce((acc, word) => (acc += word.slice(0, 1)), '')
    : '';

  const menuItemSxProps: SxProps<Theme> = { padding: (t) => t.spacing(4, 5) };
  const menuItems = [
    {
      label: 'Admin Console',
      icon: <LockIcon />,
      onClick: navigateToAdminConsole,
      adminOnly: true,
    },
    { label: 'Sign Out', icon: <LogoutIcon />, onClick: () => signOut() },
  ];
  return (
    <React.Fragment>
      <IconButton onClick={openMenu}>
        <Avatar
          src={user.image!}
          ref={avatarRef}
          sx={{
            backgroundColor: 'secondary.main',
            border: (t) => `1px solid ${t.palette.secondary.main}`,
          }}>
          {initials}
        </Avatar>
      </IconButton>
      <Menu
        open={state.isMenuOpen}
        anchorEl={avatarRef.current}
        onClick={onMenuClose}
        onClose={onMenuClose}
        anchorOrigin={{ horizontal: 'left', vertical: 50 }}
        MenuListProps={{ disablePadding: true }}>
        <MenuItem
          disableRipple={true}
          divider={true}
          sx={{
            ...menuItemSxProps,
            'cursor': 'auto',
            '&:hover': { backgroundColor: 'inherit' },
          }}>
          <Stack>
            <Typography variant={'body2'} fontWeight={100}>
              Signed in as:
            </Typography>
            <Typography variant={'body2'}>{user.email}</Typography>
          </Stack>
        </MenuItem>
        {menuItems.map(({ label, icon, onClick, adminOnly }, key) => {
          if (adminOnly && !isAdmin) return null;
          return (
            <MenuItem onClick={onClick} sx={menuItemSxProps} key={key}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  fontSize: 18,
                  variant: 'h4',
                  m: 0,
                }}>
                {label}
              </ListItemText>
              <ListItemIcon />
            </MenuItem>
          );
        })}
      </Menu>
    </React.Fragment>
  );
}
