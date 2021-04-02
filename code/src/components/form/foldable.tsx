import classnames from 'classnames';
import React, { ReactNode } from 'react';

import { Icon } from 'src/lib/library';
import css from 'src/styles/components/Form.module.scss';

import { InvisibleButton } from '../button';

export const Foldable = ({
  label,
  switcher,
  visible,
  children
}: FoldableProps) => {
  const state = visible ? 'visible' : 'hidden';
  const contentClasses = classnames(
    css['foldable-content'],
    css[`foldable-content--${state}`]
  );
  return (
    <>
      <InvisibleButton onClick={switcher} className={css['foldable-toggle']}>
        <Icon
          name={visible ? 'chevron-up' : 'chevron-down'}
          className={css['foldable-toggle']}
        />
        {label}
      </InvisibleButton>
      <div className={contentClasses}>{children}</div>
    </>
  );
};

type FoldableProps = {
  label: string;
  switcher: () => void;
  visible: boolean;
  children: ReactNode;
};
