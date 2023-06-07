import {
  Button,
  Dialog,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

import { Link } from 'components/Link';
import Settings from 'utils/settings';

export default function CookiePrompt() {
  const [state, setState] = useState({
    isConsentShown: false,
  });

  useEffect(() => {
    setTimeout(() => {
      setState({ isConsentShown: !Cookies.get(Settings.COOKIE_NAME) });
    }, 2000);
  }, []);

  function allowCookies() {
    Cookies.set(Settings.COOKIE_NAME, 'true', { expires: 90 });
    setState({ isConsentShown: false });
  }

  function denyCookies() {
    Cookies.set(Settings.COOKIE_NAME, 'false', { expires: 30 });
    setState({ isConsentShown: false });
  }

  return (
    <Dialog open={state.isConsentShown} disableScrollLock={true}>
      <DialogContent>
        <Stack spacing={4}>
          <Typography variant={'body2'}>
            My site uses cookies and similar technologies to recognise your
            preferences. Clue up on cookies by viewing my&nbsp;
            <Link href={'/cookies'}>Cookie Policy</Link>. By closing this
            pop-up, you consent to my use of cookies.
          </Typography>
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}>
            <Button
              variant={'outlined'}
              onClick={denyCookies}
              data-testid={'zb.deny'}>
              Deny
            </Button>
            <Button
              variant={'contained'}
              onClick={allowCookies}
              data-testid={'zb.accept'}>
              Accept
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
