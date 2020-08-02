import React from 'react';

import css from 'styles/components/Layout.module.scss';

export const Spacer = ({ children }) => {
  return <div className={css['spacer']}>{children}</div>;
};

export const Toolbar = ({ children }) => {
  return <div className={css['toolbar']}>{children}</div>;
};
