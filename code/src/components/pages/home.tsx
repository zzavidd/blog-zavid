import classnames from 'classnames';
import React from 'react';
import type { ColProps } from 'react-bootstrap';

import type { ReactComponent } from 'classes';
import { Field, FieldRow } from 'components/form';
import css from 'styles/pages/Home.module.scss';

export function HomeRow(props: ReactComponent) {
  const classes = classnames(css['home-row'], props.className);
  return (
    <FieldRow {...props} className={classes}>
      {props.children}
    </FieldRow>
  );
}

export function HomeField(props: ColProps) {
  return (
    <Field {...props} className={css['home-field']}>
      {props.children}
    </Field>
  );
}
