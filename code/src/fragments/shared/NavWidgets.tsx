import {
  faAddressCard,
  faBook,
  faCloud,
  faEnvelope,
  faLock,
  faMoon,
  faSun,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
import CPX from 'stylesv2/Components/Components.styles';
import WidgetStyle from 'stylesv2/Partials/Widgets.styles';

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
    <WidgetStyle.NavigationMenu {...props}>
      {paths.map(({ title, url, icon }) => {
        return (
          <WidgetStyle.NavItem onClick={() => setNavIsFocused(false)} key={url}>
            <FontAwesomeIcon icon={icon} />
            <Link href={url}>{title}</Link>
          </WidgetStyle.NavItem>
        );
      })}
    </WidgetStyle.NavigationMenu>
  );
}

export function AdminButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const router = useRouter();

  const navigateToAdmin = () => {
    void router.push('/admin');
  };

  return (
    <CPX.Button {...props} onClick={navigateToAdmin} type={'button'}>
      <FontAwesomeIcon icon={faLock} />
      <span>Sign In</span>
    </CPX.Button>
  );
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
