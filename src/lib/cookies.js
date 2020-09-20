import React, { useEffect, useState } from 'react';

import { alert } from 'components/alert.js';
import { InvisibleButton } from 'components/button';
import { Icon } from 'components/icon';
import { Fader } from 'components/transitioner.js';

export const CookiePrompt = ({ acceptCookies }) => {
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 2000);
  }, [isLoaded]);

  return (
    <Fader determinant={isLoaded} duration={500} hollow={true}>
      <div className={'cookie-prompt-wrapper'}>
        <div className={'cookie-prompt'}>
          <span>
            My site uses cookies and similar technologies to recognise your
            preferences. Clue up on cookies by viewing my{' '}
            <a href={'/cookies'}>Cookie Policy</a>. By closing this pop-up, you
            consent to my use of cookies.
          </span>
          <InvisibleButton onClick={acceptCookies}>
            <Icon name={'times'} />
          </InvisibleButton>
        </div>
      </div>
    </Fader>
  );
};

export const readCookie = (cookieName) => {
  const name = cookieName + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];

    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }

    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }

  return '';
};

export const isAuthenticated = () => {
  return readCookie('zAuth');
};

export const setCookie = (name, value, hours) => {
  const date = new Date();
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};

export const checkCookiePolicyAccepted = (message) => {
  if (readCookie('cookiesAccepted') === 'true') {
    return true;
  } else {
    if (message) {
      return alert.error(message);
    } else {
      return false;
    }
  }
};
