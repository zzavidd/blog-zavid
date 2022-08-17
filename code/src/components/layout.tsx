import classnames from 'classnames';
import type { MouseEventHandler, ReactNode } from 'react';
import React from 'react';
import type { RootStateOrAny } from 'react-redux';
import { useSelector } from 'react-redux';

import css from 'styles/components/Layout.module.scss';

import { InvisibleButton } from './button';

export function Container({ children, className }: Layout) {
  const classes = classnames(css['container'], className);
  return <div className={classes}>{children}</div>;
}

export function Flexer({ children, className }: Layout) {
  const classes = classnames(css['flexer'], className);
  return <div className={classes}>{children}</div>;
}

export function Partitioner({ children, className }: Layout) {
  const classes = classnames(css['partitioner'], className);
  return <div className={classes}>{children}</div>;
}

export function Spacer({ children }: Layout) {
  return <div className={css['spacer']}>{children}</div>;
}

export function Toolbar({
  className,
  children,
  spaceItems,
  hasBackButton,
}: Toolbar) {
  if (!children) return null;
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const classes = classnames(
    css[`toolbar-${theme}`],
    spaceItems ? css['toolbar-spaced'] : null,
    hasBackButton ? css['toolbar-with-back'] : css['toolbar-no-back'],
    className,
  );

  return <div className={classes}>{children}</div>;
}

export function ToolbarToggle({ children, toggle }: ToolbarToggle) {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  return (
    <InvisibleButton
      onClick={toggle}
      className={css[`toolbar-toggle-${theme}`]}>
      {children}
    </InvisibleButton>
  );
}

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
