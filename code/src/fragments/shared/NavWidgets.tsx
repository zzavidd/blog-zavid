import * as FA6 from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signIn, signOut, useSession } from 'next-auth/react';
import NextImage from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppTheme, Theme } from 'classes/theme';
import Contexts from 'constants/contexts';
import type { AppState } from 'constants/reducers';
import { AppActions } from 'constants/reducers';
import Settings from 'constants/settings';
import AdminLock from 'fragments/AdminLock';
import ZString from 'lib/string';
import CPX from 'styles/Components/Components.styles';
import NavStyle from 'styles/Partials/NavigationBar.styles';

const paths = [
  { title: 'Diary', url: '/diary', icon: FA6.faBook },
  { title: 'Reveries', url: '/reveries', icon: FA6.faCloud },
  { title: 'Epistles', url: '/epistles', icon: FA6.faEnvelope },
  // { title: 'Poetry', url: '/poetry' },
  // { title: 'Musings', url: '/musings' },
  { title: 'About', url: '/about', icon: FA6.faAddressCard },
  { title: 'Wishlist', url: '/wishlist', icon: FA6.faGift },
];

export function BrandImage(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      <NextImage
        src={`${Settings.CLOUDINARY_BASE_URL}/static/logos/zavid-head-logo.png`}
        alt={'Zavid Logo'}
        width={50}
        height={50}
        layout={'fixed'}
      />
    </div>
  );
}

export function NavigationLinks(props: React.HTMLAttributes<HTMLMenuElement>) {
  const [, setNavIsFocused] = useContext(Contexts.Navigation);

  return (
    <NavStyle.NavigationMenu {...props}>
      {paths.map(({ title, url, icon }) => {
        return (
          <Link href={url} passHref={true} key={url}>
            <NavStyle.NavItem onClick={() => setNavIsFocused(false)}>
              <FontAwesomeIcon icon={icon} />
              <NavStyle.NavItemLabel>{title}</NavStyle.NavItemLabel>
            </NavStyle.NavItem>
          </Link>
        );
      })}
    </NavStyle.NavigationMenu>
  );
}

export function AdminButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const appDispatch = useDispatch();
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  /**
   * Prompts a user log-in.
   */
  async function logIn() {
    await signIn('google', { redirect: true });
  }

  /**
   * Logs out the user.
   */
  async function logOut() {
    await signOut({ redirect: true });
    appDispatch(AppActions.setLoginSnackShown(false));
  }

  if (isAuthenticated) {
    return (
      <NavStyle.AdminButtonBox>
        <AdminLock>
          <Link href={'/admin'}>
            <CPX.Button {...props} type={'button'}>
              <FontAwesomeIcon icon={FA6.faLock} />
              <NavStyle.AdminButtonLabel>Admin</NavStyle.AdminButtonLabel>
            </CPX.Button>
          </Link>
        </AdminLock>
        <CPX.Button {...props} onClick={logOut} type={'button'}>
          <FontAwesomeIcon icon={FA6.faRightFromBracket} />
          <NavStyle.AdminButtonLabel>Logout</NavStyle.AdminButtonLabel>
        </CPX.Button>
      </NavStyle.AdminButtonBox>
    );
  } else {
    return (
      <CPX.Button {...props} onClick={logIn} type={'button'}>
        <FontAwesomeIcon icon={FA6.faLock} />
        <NavStyle.AdminButtonLabel>Sign In</NavStyle.AdminButtonLabel>
      </CPX.Button>
    );
  }
}

export function ThemeSwitch(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const dispatch = useDispatch();
  const { appTheme } = useSelector((state: AppState) => state.local);

  function switchTheme() {
    const oppTheme = Theme.switchTheme(appTheme);
    dispatch(AppActions.setAppTheme(oppTheme));
  }

  return (
    <CPX.Button {...props} onClick={switchTheme} type={'button'}>
      <FontAwesomeIcon
        icon={appTheme === AppTheme.DARK ? FA6.faMoon : FA6.faSun}
      />
      <span>{ZString.capitalise(appTheme)}</span>
    </CPX.Button>
  );
}
