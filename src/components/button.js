import React from 'react';
import css from 'styles/components/Button.module.scss';

export const InvisibleButton = (props) => {
  return (
    <button {...props} className={css.invisibleButton}>
      {props.children}
    </button>
  );
};
