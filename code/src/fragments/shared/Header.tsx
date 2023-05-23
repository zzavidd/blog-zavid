import { DarkModeOutlined } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Button, IconButton, Stack, Toolbar } from '@mui/material';
import { useContext } from 'react';

import { AppActions, useAppDispatch, useAppSelector } from 'constants/reducers';
import { NavigationContext } from 'utils/contexts';

export default function Header() {
  const [isNavOpen, setNavOpen] = useContext(NavigationContext);
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.local.theme);

  function openNav() {
    setNavOpen(!isNavOpen);
  }

  function toggleTheme() {
    const theme = currentTheme === 'dark' ? 'light' : 'dark';
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
          width={'100%'}>
          <IconButton onClick={openNav} size={'large'} edge={'start'}>
            <MenuIcon />
          </IconButton>
          <Stack direction={'row'} spacing={2} alignItems={'center'}>
            <Box>
              <IconButton onClick={toggleTheme} size={'large'}>
                <DarkModeOutlined />
              </IconButton>
            </Box>
            <Button variant={'outlined'}>Sign In</Button>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
