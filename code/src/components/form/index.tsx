import classnames from 'classnames';
import React, { ReactNode, useEffect, useState } from 'react';
import { Col, ColProps, Row } from 'react-bootstrap';
import { RootStateOrAny, useSelector } from 'react-redux';

import { ReactComponent, ReactHook, Substitutions } from 'classes';
import {
  AdminButton,
  ButtonSpacer,
  CancelButton,
  ConfirmButton
} from 'src/components/button';
import { Spacer, Toolbar } from 'src/components/layout';
import { Paragraph } from 'src/components/text';
import { Fader, Slider } from 'src/components/transitioner';
import css from 'styles/components/Form.module.scss';

export * from './checkbox';
export * from './fileselector';
export * from './input';
export * from './select';
export * from './textarea';

export const Form = ({
  confirmButtonText = 'Submit',
  confirmFunction,
  cancelFunction,
  isRequestPending,
  previewText = false,
  substitutions,
  children
}: Form) => {
  const [isPreviewVisible, setPreviewVisibility] = useState(false);

  return (
    <Spacer>
      <div className={css[isPreviewVisible ? 'form-pv' : 'form']}>
        <div
          className={css[isPreviewVisible ? 'form-editor-pv' : 'form-editor']}>
          {children}
        </div>
        <FormPreview
          isPreviewVisible={isPreviewVisible}
          previewText={previewText}
          substitutions={substitutions}
        />
      </div>
      <Toolbar>
        <div className={css['form-footer-buttons']}>
          <FormPreviewToggle
            previewText={previewText}
            setPreviewVisibility={setPreviewVisibility}
            isPreviewVisible={isPreviewVisible}
          />
          <ButtonSpacer className={css['form-footer-button-spacer']}>
            <ConfirmButton
              onClick={confirmFunction}
              isRequestPending={isRequestPending}>
              {confirmButtonText}
            </ConfirmButton>
            <CancelButton onClick={cancelFunction}>Cancel</CancelButton>
          </ButtonSpacer>
        </div>
      </Toolbar>
    </Spacer>
  );
};

const FormPreview = ({
  isPreviewVisible,
  previewText,
  substitutions = {}
}: FormPreview) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);

  return (
    <Slider
      determinant={isPreviewVisible}
      duration={300}
      direction={'right'}
      className={css[`form-preview-${theme}`]}
      style={{ display: isPreviewVisible ? 'block' : 'none' }}>
      <Paragraph
        className={css['form-preview-text']}
        substitutions={substitutions}>
        {previewText as string}
      </Paragraph>
    </Slider>
  );
};

const FormPreviewToggle = ({
  previewText,
  setPreviewVisibility,
  isPreviewVisible
}: FormPreviewToggle) => {
  // TODO: Make previewText just string type
  if (typeof previewText !== 'string') return null;

  const togglePreview = () => {
    setPreviewVisibility(!isPreviewVisible);
  };

  return (
    <AdminButton onClick={togglePreview} className={css['form-admin-button']}>
      {isPreviewVisible ? 'Hide Preview' : 'Show Preview'}
    </AdminButton>
  );
};

export const FieldRow = (props: ReactComponent) => {
  const classes = classnames(css['form-field-row'], props.className);
  return (
    <Row {...props} className={classes}>
      {props.children}
    </Row>
  );
};

export const Field = (props: ColProps): JSX.Element => {
  const classes = classnames(css['form-field'], props.className);
  return (
    <Col {...props} className={classes}>
      {props.children}
    </Col>
  );
};

export const DynamicField = (props: DynamicField) => {
  const { precondition, dependency, xs, sm, md, lg, xl } = props;
  const [isVisible, setVisibility] = useState(true);

  useEffect(() => {
    setVisibility(precondition);
  }, [dependency]);

  const breakpoints = Object.assign({}, { xs, sm, md, lg, xl });

  return (
    <Fader
      determinant={isVisible}
      duration={400}
      hollow={true}
      style={{ display: isVisible ? 'block' : 'none' }}>
      <Col {...breakpoints} className={css['form-field']}>
        {props.children}
      </Col>
    </Fader>
  );
};

export const Label = ({ children }: Label) => {
  return <label className={css['label']}>{children}</label>;
};

interface Form {
  confirmButtonText?: string;
  confirmFunction?: () => void;
  cancelFunction?: () => void;
  isRequestPending?: boolean;
  previewText?: string | boolean;
  substitutions?: Substitutions;
  children: ReactNode;
}

interface FormPreview {
  isPreviewVisible: boolean;
  previewText: string | boolean;
  substitutions?: Substitutions;
}

interface FormPreviewToggle {
  isPreviewVisible: boolean;
  previewText: string | boolean;
  setPreviewVisibility: ReactHook<boolean>;
}

interface DynamicField extends ColProps {
  precondition: boolean;
  dependency: unknown;
}

interface Label {
  children: ReactNode;
}
