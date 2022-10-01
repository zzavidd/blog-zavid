import { faBars, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NextImage from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Theme } from 'classes/theme';
import { Switch } from 'components/form/checkbox';
import Clickable from 'componentsv2/Clickable';
import type { AppState } from 'constants/reducers';
import { AppActions } from 'constants/reducers';
import { CLOUDINARY_BASE_URL } from 'constants/settings';
import { HeaderStyle } from 'stylesv2/Partials.styles';

const paths = [
  { title: 'Diary', url: '/diary' },
  { title: 'Reveries', url: '/reveries' },
  { title: 'Epistles', url: '/epistles' },
  { title: 'Poetry', url: '/poetry' },
  { title: 'Musings', url: '/musings' },
  { title: 'About', url: '/about' },
];

export default function Header() {
  return (
    <HeaderStyle.Header>
      <HeaderStyle.HeaderContent>
        <BrandButton />
        <NavigationLinks />
        <ThemeSwitcher />
        <AdminButton />
      </HeaderStyle.HeaderContent>
    </HeaderStyle.Header>
  );
}

function BrandButton() {
  return (
    <Link href={'/'}>
      <HeaderStyle.BrandContainer>
        <NextImage
          src={`${CLOUDINARY_BASE_URL}/static/logos/zavid-head-logo.png`}
          alt={'Zavid Logo'}
          width={50}
          height={50}
          layout={'fixed'}
        />
      </HeaderStyle.BrandContainer>
    </Link>
  );
}

function NavigationLinks() {
  const [state, setState] = useState({ isMenuOpen: false });

  function toggleNavigationMenu() {
    setState({ isMenuOpen: !state.isMenuOpen });
  }

  return (
    <HeaderStyle.Navigation>
      <HeaderStyle.NavToggle type={'button'} onClick={toggleNavigationMenu}>
        <FontAwesomeIcon icon={faBars} />
      </HeaderStyle.NavToggle>
      <HeaderStyle.NavigationMenu open={state.isMenuOpen}>
        {paths.map(({ title, url }) => {
          return (
            <HeaderStyle.NavigationMenuLink key={url}>
              <Link href={url}>{title}</Link>
            </HeaderStyle.NavigationMenuLink>
          );
        })}
      </HeaderStyle.NavigationMenu>
    </HeaderStyle.Navigation>
  );
}

function AdminButton() {
  const navigateToAdmin = () => (location.href = '/admin');
  return <Clickable.Icon onClick={navigateToAdmin} icon={faLock} />;
}

function ThemeSwitcher() {
  const dispatch = useDispatch();
  const { appTheme } = useSelector((state: AppState) => state);

  const switchTheme = () => {
    const oppTheme = Theme.switchTheme(appTheme);
    dispatch(AppActions.setAppTheme(oppTheme));
  };

  return (
    <Switch
      onChange={switchTheme}
      checked={!Theme.isLight(appTheme)}
      checkedIcon={'moon'}
      uncheckedIcon={'sun'}
    />
  );
}
