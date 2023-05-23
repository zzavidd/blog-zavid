import { DarkModeOutlined } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Button, IconButton, Stack, Toolbar } from '@mui/material';
import { useContext } from 'react';

import { NavigationContext } from 'utils/contexts';

export default function Header() {
  const [isNavOpen, setNavOpen] = useContext(NavigationContext);

  function openNav() {
    setNavOpen(!isNavOpen);
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
          <Stack direction={'row'} spacing={2}>
            <IconButton>
              <DarkModeOutlined />
            </IconButton>
            <Button variant={'outlined'}>Sign In</Button>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
