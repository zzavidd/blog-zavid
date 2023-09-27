import {
  Button,
  Dialog,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import { Link } from 'components/Link';
import Settings from 'utils/settings';

export default function CookiePrompt() {
  const [state, setState] = useState({ isConsentShown: false });
  const [cookies, setCookie] = useCookies([Settings.COOKIES.CONSENT]);

  useEffect(() => {
    setTimeout(() => {
      setState({ isConsentShown: !cookies[Settings.COOKIES.CONSENT] });
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function allowCookies() {
    const expires = dayjs().add(90, 'days').toDate();
    setCookie(Settings.COOKIES.CONSENT, 'true', { expires });
    setState({ isConsentShown: false });
  }

  function denyCookies() {
    const expires = dayjs().add(30, 'days').toDate();
    setCookie(Settings.COOKIES.CONSENT, 'false', { expires });
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
