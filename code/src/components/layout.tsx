import classnames from 'classnames';
import React from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import MediaQuery from 'react-responsive';

import css from '../styles/components/Layout.module.scss';

import { InvisibleButton } from './button';

interface ResponsiveOptions {
  defaultView: JSX.Element;
  xl?: JSX.Element;
  laptopView?: JSX.Element;
  tabletView?: JSX.Element;
  mobileView?: JSX.Element;
}

export const Container = ({ children, className }) => {
  const classes = classnames(css['container'], className);
  return <div className={classes}>{children}</div>;
};

export const Flexer = ({ children, className }) => {
  const classes = classnames(css['flexer'], className);
  return <div className={classes}>{children}</div>;
};

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
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const classes = classnames(
    css[`toolbar-${theme}`],
    spaceItems ? css['toolbar-spaced'] : null,
    hasBackButton ? css['toolbar-with-back'] : css['toolbar-no-back'],
    className
  );

  return <div className={classes}>{children}</div>;
};

export const ToolbarToggle = ({ children, toggle }) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  return (
    <InvisibleButton
      onClick={toggle}
      className={css[`toolbar-toggle-${theme}`]}>
      {children}
    </InvisibleButton>
  );
};

export const Responsive = ({
  defaultView = null,
  xl,
  laptopView,
  tabletView,
  mobileView
}: ResponsiveOptions) => {
  if (xl) {
    return (
      <>
        <MediaQuery minWidth={1200}>{defaultView}</MediaQuery>
        <MediaQuery maxWidth={1200}>{xl}</MediaQuery>
      </>
    );
  } else if (laptopView) {
    return (
      <>
        <MediaQuery minWidth={992}>{defaultView}</MediaQuery>
        <MediaQuery maxWidth={992}>{laptopView}</MediaQuery>
      </>
    );
  } else if (tabletView) {
    return (
      <>
        <MediaQuery minWidth={768}>{defaultView}</MediaQuery>
        <MediaQuery maxWidth={768}>{tabletView}</MediaQuery>
      </>
    );
  } else {
    return (
      <>
        <MediaQuery minWidth={576}>{defaultView}</MediaQuery>
        <MediaQuery maxWidth={576}>{mobileView}</MediaQuery>
      </>
    );
  }
};
