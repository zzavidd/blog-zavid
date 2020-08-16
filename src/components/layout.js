import classnames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';

import css from 'styles/components/Layout.module.scss';

export const Spacer = ({ children }) => {
  return <div className={css['spacer']}>{children}</div>;
};

export const Toolbar = ({ className, children }) => {
  const theme = useSelector(({ theme }) => theme);
  const classes = classnames(css[`toolbar-${theme}`], className);
  return <div className={classes}>{children}</div>;
};
