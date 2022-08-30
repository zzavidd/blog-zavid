import classnames from 'classnames';
import type { NextPage } from 'next';
import React from 'react';
import type { RootStateOrAny } from 'react-redux';
import { useSelector } from 'react-redux';

import { Container } from 'components/layout';
import { VanillaLink } from 'components/text';
import AdminGateway from 'fragments/AdminGateway';
import css from 'styles/pages/Admin.module.scss';

const links = [
  { name: 'Posts', url: 'posts' },
  { name: 'Diary', url: 'diary' },
  { name: 'Pages', url: 'pages' },
  { name: 'Subscribers', url: 'subscribers' },
];

// eslint-disable-next-line react/function-component-definition
const Admin: NextPage = () => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  return (
    <AdminGateway>
      <Container>
        <div className={css['admin-page']}>
          {links.map(({ name, url }, key) => {
            const classes = classnames(
              css['admin-block'],
              css[`admin-block-${theme}`],
              css[`admin-block-${url}`],
            );
            return (
              <VanillaLink href={`/admin/${url}`} key={key} className={classes}>
                {name}
              </VanillaLink>
            );
          })}
        </div>
      </Container>
    </AdminGateway>
  );
};

export default Admin;
