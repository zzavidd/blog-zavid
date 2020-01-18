import React, { Component } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setTheme } from '~/reducers/actions';

import { InvisibleButton } from '~/components/button.js';
import { ThemedIcon } from '~/components/icon.js';
import { cloudinary, theme as THEME } from '~/constants/settings.js';

import css from '~/styles/partials.scss';

class Header extends Component {
  constructor() {
    super();
  }

  render() {
    const { theme, setTheme } = this.props;

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
            <InvisibleButton onClick={() => THEME.switch(theme, setTheme)}>
              <ThemedIcon
                name={theme === 'light' ? 'moon' : 'sun'}
                color={theme === 'light' ? 'black' : 'white'}
              />
            </InvisibleButton>
          </Nav.Item>
        </Container>
      </Navbar>
    );
  }
}

const mapStateToProps = state => ({
  theme: state.theme
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setTheme
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Header);
