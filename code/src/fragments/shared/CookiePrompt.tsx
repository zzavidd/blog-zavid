import classnames from 'classnames';
import Cookies from 'js-cookie';
import React, { useState } from 'react';

import { InvisibleButton } from 'components/button';
import { Icon } from 'components/library';

export default function CookiePrompt() {
  const initialState = checkCookiePolicyAccepted();
  const [wasAccepted] = useState(initialState);
  const [isAccepted, setAcceptance] = useState(initialState);

  const state = wasAccepted ? 'initial' : isAccepted ? 'hidden' : 'visible';
  const classes = classnames('cookie-prompt', `cookie-prompt--${state}`);
  return (
    <div className={classes}>
      <div className={'cookie-prompt__wrapper'}>
        <span>
          My site uses cookies and similar technologies to recognise your
          preferences. Clue up on cookies by viewing my{' '}
          <a href={'/cookies'}>Cookie Policy</a>. By closing this pop-up, you
          consent to my use of cookies.
        </span>
        <InvisibleButton
          onClick={() => {
            Cookies.set('cookiesAccepted', 'true', { expires: 365 * 24 });
            setAcceptance(true);
          }}>
          <Icon name={'times'} />
        </InvisibleButton>
      </div>
    </div>
  );
}

function checkCookiePolicyAccepted(): boolean {
  return Cookies.get('cookiesAccepted') === 'true';
}