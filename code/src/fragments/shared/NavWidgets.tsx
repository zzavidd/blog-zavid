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
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppTheme, Theme } from 'classes/theme';
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

export function BrandButton(props: React.HTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link href={'/'}>
      <a {...props}>
        <NextImage
          src={`${CLOUDINARY_BASE_URL}/static/logos/zavid-head-logo.png`}
          alt={'Zavid Logo'}
          width={50}
          height={50}
          layout={'fixed'}
        />
      </a>
    </Link>
  );
}

export function NavigationLinks(props: React.HTMLAttributes<HTMLElement>) {
  // const [state, setState] = useState({ isMenuOpen: false });

  // function toggleNavigationMenu() {
  //   setState({ isMenuOpen: !state.isMenuOpen });
  // }

  return (
    <WidgetStyle.Navigation {...props}>
      {/* <button type={'button'} onClick={toggleNavigationMenu}>
        <FontAwesomeIcon icon={faBars} />
      </button> */}
      <WidgetStyle.NavigationMenu>
        {paths.map(({ title, url, icon }) => {
          return (
            <WidgetStyle.NavItem key={url}>
              <FontAwesomeIcon icon={icon} />
              <Link href={url}>{title}</Link>
            </WidgetStyle.NavItem>
          );
        })}
      </WidgetStyle.NavigationMenu>
    </WidgetStyle.Navigation>
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
    <button {...props} onClick={navigateToAdmin} type={'button'}>
      <FontAwesomeIcon icon={faLock} />
    </button>
  );
}

export function ThemeSwitch(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const dispatch = useDispatch();
  const { appTheme } = useSelector((state: AppState) => state);

  const checked = useMemo(() => {
    return appTheme === AppTheme.DARK;
  }, [appTheme]);

  function switchTheme() {
    const oppTheme = Theme.switchTheme(appTheme);
    dispatch(AppActions.setAppTheme(oppTheme));
  }

  return (
    <CPX.Button {...props} onClick={switchTheme} type={'button'}>
      <FontAwesomeIcon icon={checked ? faMoon : faSun} />
      <span>{appTheme.charAt(0).toUpperCase() + appTheme.substring(1)}</span>
    </CPX.Button>
  );
}
