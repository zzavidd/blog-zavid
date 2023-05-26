import { Dialog, DialogContent, Typography } from '@mui/material';

import { Link } from 'componentsv2/Link';
import { AppActions, useAppDispatch, useAppSelector } from 'constants/reducers';

export default function CookiePrompt() {
  const { cookiePolicyAccepted } = useAppSelector((state) => state.local);
  const dispatch = useAppDispatch();

  function acceptCookiePolicy() {
    dispatch(AppActions.setCookiePolicyAccepted(true));
  }

  return (
    <Dialog
      open={!cookiePolicyAccepted}
      onClose={acceptCookiePolicy}
      hideBackdrop={true}>
      <DialogContent>
        <Typography variant={'body2'}>
          My site uses cookies and similar technologies to recognise your
          preferences. Clue up on cookies by viewing my&nbsp;
          <Link href={'/cookies'}>Cookie Policy</Link>. By closing this pop-up,
          you consent to my use of cookies.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
