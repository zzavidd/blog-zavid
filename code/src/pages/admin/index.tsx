import classnames from 'classnames';
import { NextPageContext } from 'next';
import React from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';

import { Container } from 'src/components/layout';
import { VanillaLink } from 'src/components/text';
import css from 'src/styles/pages/Admin.module.scss';

const links = [
  { name: 'Posts', url: 'posts' },
  { name: 'Diary', url: 'diary' },
  { name: 'Pages', url: 'pages' },
  { name: 'Subscribers', url: 'subscribers' }
];

const Admin = () => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
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

Admin.getInitialProps = async ({ query }: NextPageContext) => {
  return { ...query };
};

export default Admin;