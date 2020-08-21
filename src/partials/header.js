import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import { InvisibleButton } from 'components/button.js';
import { ThemedIcon } from 'components/icon.js';
import { CloudinaryImage } from 'components/image.js';
import { setTheme } from 'reducers/actions';
import css from 'styles/Partials.module.scss';

const Header = () => {
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
    <Navbar className={css[`nav-${theme}`]} expand={'md'} sticky={'top'}>
      <Container fluid={'lg'}>
        <Navbar.Brand href={'/'}>
          <CloudinaryImage
            src={`/static/logos/zavid-logo-text-${theme}.png`}
            alt={'ZAVID Logo'}
            lazy={{ height: 40 }}
          />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className={'justify-content-center'}>
            <Nav.Link href={'/reveries'}>Reveries</Nav.Link>
            <Nav.Link href={'#'}>Epistles</Nav.Link>
            <Nav.Link href={'#'}>Diary</Nav.Link>
            <Nav.Link href={'#'}>About</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Nav.Item>
          <InvisibleButton onClick={switchTheme}>
            <ThemedIcon name={isLightTheme ? 'moon' : 'sun'} />
          </InvisibleButton>
        </Nav.Item>
      </Container>
    </Navbar>
  );
};

export default Header;
