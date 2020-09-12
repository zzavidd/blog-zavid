import classnames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import MediaQuery from 'react-responsive';

import css from 'styles/components/Layout.module.scss';

import { InvisibleButton } from './button';

export const Partitioner = ({ children, className }) => {
  const classes = classnames(css['partitioner'], className);
  return <div className={classes}>{children}</div>;
};

export const Spacer = ({ children }) => {
  return <div className={css['spacer']}>{children}</div>;
};

/**
 * Bottom toolbar for items
 * @param {object} props The properties.
 * @param {string} props.className The toolbar class.
 * @param {React.Component[]} props.children The toolbar items.
 * @param {boolean} props.spaceItems Indicates whether items should be spaced.
 * @param {boolean} props.hasBackButton Indicates if toolbar contains back button.
 * @returns {React.Component} The component.
 */
export const Toolbar = ({ className, children, spaceItems, hasBackButton }) => {
  if (!children) return null;
  const theme = useSelector(({ theme }) => theme);
  const classes = classnames(
    css[`toolbar-${theme}`],
    spaceItems ? css['toolbar-spaced'] : null,
    hasBackButton ? css['toolbar-with-back'] : css['toolbar-no-back'],
    className
  );

  return <div className={classes}>{children}</div>;
};

export const ToolbarToggle = ({ children, toggle }) => {
  const theme = useSelector(({ theme }) => theme);
  return (
    <InvisibleButton
      onClick={toggle}
      className={css[`toolbar-toggle-${theme}`]}>
      {children}
    </InvisibleButton>
  );
};

export const Responsive = ({ defaultView = null, mobileView = null }) => {
  return (
    <>
      <MediaQuery minWidth={576}>{defaultView}</MediaQuery>
      <MediaQuery maxWidth={576}>{mobileView}</MediaQuery>
    </>
  );
};
