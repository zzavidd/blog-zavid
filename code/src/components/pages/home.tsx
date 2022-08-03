import classnames from 'classnames';
import React from 'react';
import type { ColProps } from 'react-bootstrap';

import type { ReactComponent } from 'classes';
import { Field, FieldRow } from 'src/components/form';
import css from 'src/styles/pages/Home.module.scss';

export const HomeRow = (props: ReactComponent) => {
  const classes = classnames(css['home-row'], props.className);
  return (
    <FieldRow {...props} className={classes}>
      {props.children}
    </FieldRow>
  );
};

export const HomeField = (props: ColProps) => {
  return (
    <Field {...props} className={css['home-field']}>
      {props.children}
    </Field>
  );
};
