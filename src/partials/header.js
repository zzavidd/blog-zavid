import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import Switch from 'react-switch';

import { ThemedIcon } from 'components/icon.js';
import CloudImage from 'components/image.js';
import { Responsive } from 'components/layout';
import { setTheme } from 'lib/reducers/actions';
import css from 'styles/Partials.module.scss';

const Header = () => {
  const theme = useSelector(({ theme }) => theme);

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
            </>
          }
          mobileView={
            <>
              <ThemeSwitcher />
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
          <Nav.Link href={'#'}>Epistles</Nav.Link>
          <Nav.Link href={'#'}>Musings</Nav.Link>
          <Nav.Link href={'#'}>Diary</Nav.Link>
          <Nav.Link href={'#'}>About</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </>
  );
};

const ThemeSwitcher = () => {
  const dispatch = useDispatch();
  const theme = useSelector(({ theme }) => theme);

  const isLightTheme = theme === 'light';

  const switchTheme = () => {
    const oppositeTheme = isLightTheme ? 'dark' : 'light';
    dispatch(setTheme(oppositeTheme));
    document.body.classList.add(`body-${oppositeTheme}`);
    document.body.classList.remove(`body-${theme}`);
  };
  return (
    <Nav.Item>
      <Switch
        onChange={switchTheme}
        checked={!isLightTheme}
        className={css['theme-toggle']}
        checkedIcon={<ThemedIcon name={'moon'} />}
        uncheckedIcon={<ThemedIcon name={'sun'} />}
      />
    </Nav.Item>
  );
};

export default Header;
