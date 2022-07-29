import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import type { RootStateOrAny } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';

import type { ReactComponent } from 'classes';
import { Theme } from 'classes';
import { InvisibleButton } from 'src/components/button';
import { Switch } from 'src/components/form/checkbox';
import CloudImage from 'src/components/image';
import { Icon, Responsive } from 'src/lib/library';
import { setTheme } from 'src/lib/reducers';
import css from 'src/styles/Partials.module.scss';

const Header = () => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);

  return (
    <Navbar
      className={css[`nav-${theme}`]}
      expand={'md'}
      sticky={'top'}
      variant={theme}>
      <Container fluid={'lg'}>
        <BrandButton />
        <Responsive
          defaultView={
            <>
              <NavigationLinks />
              <ThemeSwitcher />
              <AdminButton />
            </>
          }
          tabletView={
            <>
              <ThemeSwitcher />
              <AdminButton />
              <NavigationLinks />
            </>
          }
        />
      </Container>
    </Navbar>
  );
};

const BrandButton = () => {
  return (
    <Navbar.Brand href={'/'}>
      <CloudImage
        containerClassName={css['nav-brand']}
        src={`/static/logos/zavid-head-logo.png`}
        version={1598802245}
      />
    </Navbar.Brand>
  );
};

const NavigationLinks = () => {
  return (
    <>
      <Navbar.Toggle className={css[`nav-toggler`]} />
      <Navbar.Collapse>
        <Nav className={'justify-content-center'}>
          <Nav.Link href={'/reveries'}>Reveries</Nav.Link>
          <Nav.Link href={'/diary'}>Diary</Nav.Link>
          <Nav.Link href={'/epistles'}>Epistles</Nav.Link>
          <DisabledNavLink>Poetry</DisabledNavLink>
          <DisabledNavLink>Musings</DisabledNavLink>
          <Nav.Link href={'/about'}>About</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </>
  );
};

const AdminButton = () => {
  const navigateToAdmin = () => (location.href = '/admin');
  return (
    <Nav.Item>
      <InvisibleButton
        onClick={navigateToAdmin}
        className={css[`nav-admin-button`]}>
        <Icon name={'lock'} withRightSpace={false} />
      </InvisibleButton>
    </Nav.Item>
  );
};

const DisabledNavLink = ({ children }: ReactComponent) => {
  return (
    <Nav.Link href={'#'} className={css['nav-link-disabled']} disabled>
      {children}
    </Nav.Link>
  );
};

const ThemeSwitcher = () => {
  const dispatch = useDispatch();
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);

  const switchTheme = () => {
    const oppTheme = Theme.switchTheme(theme);
    dispatch(setTheme(oppTheme));
    document.body.classList.add(`body-${oppTheme}`);
    document.body.classList.remove(`body-${theme}`);
  };
  return (
    <Nav.Item>
      <Switch
        onChange={switchTheme}
        checked={!Theme.isLight(theme)}
        checkedIcon={'moon'}
        uncheckedIcon={'sun'}
      />
    </Nav.Item>
  );
};

export default Header;
