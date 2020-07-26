import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from 'reducers/actions';

import { InvisibleButton } from 'components/button.js';
import { ThemedIcon } from 'components/icon.js';
import { cloudinary } from 'constants/settings.js';

import css from 'styles/Partials.module.scss';

const Header = () => {
  const dispatch = useDispatch();
  const theme = useSelector(({theme}) => theme);

  return (
    <Navbar className={css[`nav-${theme}`]} expand='lg' sticky='top'>
      <Container>
        <Navbar.Brand href='/'>
          <img
            src={`${cloudinary.url}/h_40/v1577385731/static/logos/zavid-logo-text-${theme}.png`}
            alt='ZAVID Logo'
          />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className='justify-content-center'>
            <Nav.Link href='/reveries'>Reveries</Nav.Link>
            <Nav.Link href='#'>Epistles</Nav.Link>
            <Nav.Link href='#'>Diary</Nav.Link>
            <Nav.Link href='#'>About</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Nav.Item>
          <InvisibleButton onClick={() => dispatch(toggleTheme(theme))}>
            <ThemedIcon
              name={theme === 'light' ? 'moon' : 'sun'}
              color={theme === 'light' ? 'black' : 'white'}
            />
          </InvisibleButton>
        </Nav.Item>
      </Container>
    </Navbar>
  );
};

export default Header;
