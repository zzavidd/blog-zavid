import {
  faAddressCard,
  faBook,
  faCloud,
  faEnvelope,
  faLock,
  faMoon,
  faRightFromBracket,
  faSun,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signIn, signOut, useSession } from 'next-auth/react';
import NextImage from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppTheme, Theme } from 'classes/theme';
import Contexts from 'constants/contexts';
import type { AppState } from 'constants/reducers';
import { AppActions } from 'constants/reducers';
import { CLOUDINARY_BASE_URL } from 'constants/settings';
import AdminLock from 'fragments/AdminLock';
import CPX from 'stylesv2/Components/Components.styles';
import NavStyle from 'stylesv2/Partials/NavigationBar.styles';

const paths = [
  { title: 'Diary', url: '/diary', icon: faBook },
  { title: 'Reveries', url: '/reveries', icon: faCloud },
  { title: 'Epistles', url: '/epistles', icon: faEnvelope },
  // { title: 'Poetry', url: '/poetry' },
  // { title: 'Musings', url: '/musings' },
  { title: 'About', url: '/about', icon: faAddressCard },
];

export function BrandImage(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      <NextImage
        src={`${CLOUDINARY_BASE_URL}/static/logos/zavid-head-logo.png`}
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
          <NavStyle.NavItem onClick={() => setNavIsFocused(false)} key={url}>
            <FontAwesomeIcon icon={icon} />
            <Link href={url}>{title}</Link>
          </NavStyle.NavItem>
        );
      })}
    </NavStyle.NavigationMenu>
  );
}

export function AdminButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const appDispatch = useDispatch();
  const router = useRouter();
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  // function navigateToAdmin() {
  //   void router.push('/admin');
  // }

  async function logIn() {
    await signIn('google', { redirect: true });
  }

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
              <FontAwesomeIcon icon={faLock} />
              <NavStyle.AdminButtonLabel>Admin</NavStyle.AdminButtonLabel>
            </CPX.Button>
          </Link>
        </AdminLock>
        <CPX.Button {...props} onClick={logOut} type={'button'}>
          <FontAwesomeIcon icon={faRightFromBracket} />
          <NavStyle.AdminButtonLabel>Logout</NavStyle.AdminButtonLabel>
        </CPX.Button>
      </NavStyle.AdminButtonBox>
    );
  } else {
    return (
      <CPX.Button {...props} onClick={logIn} type={'button'}>
        <FontAwesomeIcon icon={faLock} />
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
      <FontAwesomeIcon icon={appTheme === AppTheme.DARK ? faMoon : faSun} />
      <span>{appTheme.charAt(0).toUpperCase() + appTheme.substring(1)}</span>
    </CPX.Button>
  );
}
