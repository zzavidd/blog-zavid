import classnames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';

import { Container } from 'components/layout';
import { VanillaLink } from 'components/text';
import css from 'styles/pages/Admin.module.scss';

const links = [
  { name: 'Posts', url: 'posts' },
  { name: 'Diary', url: 'diary' },
  { name: 'Pages', url: 'pages' },
  { name: 'Subscribers', url: 'subscribers' }
];

export default () => {
  const theme = useSelector(({ theme }) => theme);
  return (
    <Container>
      <div className={css['admin-page']}>
        {links.map(({ name, url }, key) => {
          const classes = classnames(
            css['admin-block'],
            css[`admin-block-${theme}`],
            css[`admin-block-${url}`]
          );
          return (
            <VanillaLink href={`/admin/${url}`} key={key} className={classes}>
              {name}
            </VanillaLink>
          );
        })}
      </div>
    </Container>
  );
};
