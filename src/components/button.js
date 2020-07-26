import React, { Component } from 'react';
import css from '~/styles/components/button.scss';

export const InvisibleButton = (props) => {
  return (
    <button {...props} className={css.invisibleButton}>
      {props.children}
    </button>
  );
};
