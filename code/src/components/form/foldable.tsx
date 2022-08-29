import classnames from 'classnames';
import type { ReactNode } from 'react';
import React from 'react';

import { Icon } from 'lib/library';
import css from 'styles/components/Form.module.scss';

import { InvisibleButton } from '../button';

export function Foldable({
  label,
  switcher,
  visible,
  children,
}: FoldableProps) {
  const state = visible ? 'visible' : 'hidden';
  const contentClasses = classnames(
    css['foldable-content'],
    css[`foldable-content--${state}`],
  );
  return (
    <React.Fragment>
      <InvisibleButton onClick={switcher} className={css['foldable-toggle']}>
        <Icon
          name={visible ? 'chevron-up' : 'chevron-down'}
          className={css['foldable-toggle']}
        />
        {label}
      </InvisibleButton>
      <div className={contentClasses}>{children}</div>
    </React.Fragment>
  );
}

interface FoldableProps {
  label: string;
  switcher: () => void;
  visible: boolean;
  children: ReactNode;
}
