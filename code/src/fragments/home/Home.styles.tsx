import classnames from 'classnames';
import React from 'react';
import type { ColProps, RowProps } from 'react-bootstrap';

import { Field, FieldRow } from 'components/form';
import css from 'styles/pages/Home.module.scss';

// TODO: Styled Components should eradicate this file
export function HomeRow(props: RowProps) {
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