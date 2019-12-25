import React, { Component } from 'react';
import { Container, Col, Row, Dropdown, Nav, Navbar } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleTheme } from '~/reducers/actions';

import css from '~/styles/_partials.scss';

class Header extends Component {
  constructor(){
    super();
  }

  render(){
    const { theme } = this.props;
    console.log(theme);

    return (
      <Navbar className={css[`nav-${theme}`]} expand="lg" sticky="top">
        <Navbar.Brand href="/">
          <img
            src={``}
            height="40"
            alt="ZAVID Logo" />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ml-auto">
            <Nav.Link href="#">Reveries</Nav.Link>
            <Nav.Link href="#">Epistles</Nav.Link>
            <Nav.Link href="#">About</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

const mapStateToProps = state => ({
  theme: state.theme
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    toggleTheme
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Header);