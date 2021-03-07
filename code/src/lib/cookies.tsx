import classnames from 'classnames';
import React, { useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';

import { InvisibleButton } from 'src/components/button';
import { Icon } from 'src/lib/library';

export const CookiePrompt = () => {
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
            setCookie('cookiesAccepted', true, 365 * 24);
            setAcceptance(true);
          }}>
          <Icon name={'times'} />
        </InvisibleButton>
      </div>
    </div>
  );
};

export const readCookie = (cookieName: string): string => {
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

export const setCookie = (
  name: string,
  value: unknown,
  hours: number
): void => {
  const date = new Date();
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};

export const clearCookie = (name: string): void => {
  setCookie(name, '', -1);
};

export const checkCookiePolicyAccepted = (): boolean => {
  return readCookie('cookiesAccepted') === 'true';
};

export const isAuthenticated = (): boolean => {
  const user = useSelector(({ user }: RootStateOrAny) => user);
  return user.isAuthenticated;
};
