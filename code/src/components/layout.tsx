import classnames from 'classnames';
import React, { MouseEventHandler } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import MediaQuery from 'react-responsive';

import css from 'src/styles/components/Layout.module.scss';

import { InvisibleButton } from './button';

export const Container = ({ children, className }: Layout) => {
  const classes = classnames(css['container'], className);
  return <div className={classes}>{children}</div>;
};

export const Flexer = ({ children, className }: Layout) => {
  const classes = classnames(css['flexer'], className);
  return <div className={classes}>{children}</div>;
};

export const Partitioner = ({ children, className }: Layout) => {
  const classes = classnames(css['partitioner'], className);
  return <div className={classes}>{children}</div>;
};

export const Spacer = ({ children }: Layout) => {
  return <div className={css['spacer']}>{children}</div>;
};
export const Toolbar = ({
  className,
  children,
  spaceItems,
  hasBackButton
}: Toolbar) => {
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

export const ToolbarToggle = ({ children, toggle }: ToolbarToggle) => {
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
  defaultView,
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

interface Layout {
  className: string;
  children: string | JSX.Element | JSX.Element[];
}

interface Toolbar extends Layout {
  spaceItems: boolean;
  hasBackButton: boolean;
}

interface ToolbarToggle extends Layout {
  toggle: MouseEventHandler;
}

interface ResponsiveOptions {
  defaultView?: JSX.Element;
  xl?: JSX.Element;
  laptopView?: JSX.Element;
  tabletView?: JSX.Element;
  mobileView?: JSX.Element;
}
