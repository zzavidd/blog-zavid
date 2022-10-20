import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import { AppTheme } from 'classes/theme';
import Clickable from 'componentsv2/Clickable';
import type { AppState } from 'constants/reducers';
import { AppActions } from 'constants/reducers';
import { CookieStyle } from 'stylesv2/Components/Popup.styles';
import TextStyle from 'stylesv2/Components/Text.styles';
import { THEME } from 'stylesv2/Variables.styles';

export default function CookiePrompt() {
  const { cookiePolicyAccepted } = useSelector(
    (state: AppState) => state.local,
  );
  const appDispatch = useDispatch();

  function acceptCookiePolicy() {
    appDispatch(AppActions.setCookiePolicyAccepted(true));
  }

  return (
    <ThemeProvider theme={THEME[AppTheme.DARK]}>
      <CookieStyle.Container visible={!cookiePolicyAccepted}>
        <CookieStyle.Dialog>
          <CookieStyle.Text>
            My site uses cookies and similar technologies to recognise your
            preferences. Clue up on cookies by viewing my&nbsp;
            <Link href={'/cookies'}>
              <TextStyle.Emphasis.Anchor>
                Cookie Policy
              </TextStyle.Emphasis.Anchor>
            </Link>
            . By closing this pop-up, you consent to my use of cookies.
          </CookieStyle.Text>
          <Clickable.Icon onClick={acceptCookiePolicy} icon={faTimes} />
        </CookieStyle.Dialog>
      </CookieStyle.Container>
    </ThemeProvider>
  );
}
