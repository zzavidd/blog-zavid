const classnames = require('classnames');
import React from 'react';

import css from 'styles/components/Form.module.scss';

export const Checkbox = ({ name, label, checked, onChange, className }) => {
  const classes = classnames(css['checkbox-group'], className);
  return (
    <label className={classes}>
      <span className={css['checkbox-label']}>{label}</span>
      <input
        type={'checkbox'}
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <span className={css['checkbox-mark']} />
    </label>
  );
};
