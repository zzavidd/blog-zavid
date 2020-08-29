import classnames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import MediaQuery from 'react-responsive';

import css from 'styles/components/Layout.module.scss';

export const Partitioner = ({ children, className }) => {
  const classes = classnames(css['partitioner'], className);
  return <div className={classes}>{children}</div>;
};

export const Spacer = ({ children }) => {
  return <div className={css['spacer']}>{children}</div>;
};

export const Toolbar = ({ className, children }) => {
  const theme = useSelector(({ theme }) => theme);
  const classes = classnames(css[`toolbar-${theme}`], className);
  return <div className={classes}>{children}</div>;
};

export const Responsive = ({ defaultView, mobileView }) => {
  return (
    <>
      <MediaQuery minWidth={576}>{defaultView}</MediaQuery>
      <MediaQuery maxWidth={576}>{mobileView}</MediaQuery>
    </>
  );
};
