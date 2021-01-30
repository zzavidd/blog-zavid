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
  return (
    <>
      <InvisibleButton onClick={switcher} className={css['foldable-toggle']}>
        <Icon
          name={visible ? 'chevron-up' : 'chevron-down'}
          className={css['foldable-toggle']}
        />
        {label}
      </InvisibleButton>
      <div className={css['foldable-content']} hidden={!visible}>
        {children}
      </div>
    </>
  );
};

type FoldableProps = {
  label: string;
  switcher: () => void;
  visible: boolean;
  children: ReactNode;
};
