import classnames from 'classnames';
import React, { MouseEventHandler, ReactNode } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';

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

interface Layout {
  className?: string;
  children: ReactNode;
}

interface Toolbar extends Layout {
  spaceItems?: boolean;
  hasBackButton?: boolean;
}

interface ToolbarToggle extends Layout {
  toggle: MouseEventHandler;
}
