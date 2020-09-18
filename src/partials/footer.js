import classnames from 'classnames';
import React from 'react';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import css from 'styles/Partials.module.scss';

const footerLinks = [
  { name: 'About', url: '/about' },
  { name: 'Privacy Policy', url: '/privacy' },
  { name: 'Cookie Policy', url: '/cookies' }
];

export default () => {
  const theme = useSelector(({ theme }) => theme);
  const classes = classnames(css['footer'], css[`footer-${theme}`]);
  return (
    <footer className={classes}>
      <Container>
        {footerLinks.map(({ name, url }, key) => {
          return (
            <a key={key} href={url} className={css['footer-link']}>
              {name}
            </a>
          );
        })}
      </Container>
    </footer>
  );
};
