import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import {
  AdminButton,
  ButtonSpacer,
  CancelButton,
  ConfirmButton
} from 'components/button';
import { Spacer, Toolbar } from 'components/layout';
import { Paragraph } from 'components/text';
import { Fader, Slider } from 'components/transitioner';
import css from 'styles/components/Form.module.scss';

export * from './checkbox';
export * from './fileselector';
export * from './input';
export * from './select';
export * from './textarea';

/**
 * A form component.
 * @param {object} props - The component props.
 * @param {string} [props.confirmButtonText] - The text displayed on the confirm button.
 * @param {Function} props.confirmFunction - The function called on clicking the confirm button.
 * @param {Function} props.cancelFunction - The function called on clicking the cancel button.
 * @param {boolean} props.isRequestPending - Indicates whether a request is currently pending.
 * @param {string} props.previewText - The text to be shown in the preview.
 * @param {object} props.substitutions - The expected text substitutions (e.g. images).
 * @param {any} props.children - The component children.
 * @returns {React.Component} The component.
 */
export const Form = ({
  confirmButtonText = 'Submit',
  confirmFunction,
  cancelFunction,
  isRequestPending,
  previewText = false,
  substitutions,
  children
}) => {
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
          <FormAdminButton
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

const FormPreview = ({ isPreviewVisible, previewText, substitutions = {} }) => {
  const theme = useSelector(({ theme }) => theme);

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
        {previewText}
      </Paragraph>
    </Slider>
  );
};

const FormAdminButton = ({
  previewText,
  setPreviewVisibility,
  isPreviewVisible
}) => {
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

/**
 * A row of fields in the form.
 * @param {object} props - The component props.
 * @param {any} props.children - The component children.
 * @returns {React.Component} The component.
 */
export const FieldRow = (props) => {
  const classes = classnames(css['form-field-row'], props.className);
  return (
    <Row {...props} className={classes}>
      {props.children}
    </Row>
  );
};

/**
 * A form field component.
 * @param {object} props - The component props.
 * @returns {React.Component} The component.
 */
export const Field = (props) => {
  const classes = classnames(css['form-field'], props.className);
  return (
    <Col {...props} className={classes}>
      {props.children}
    </Col>
  );
};

/**
 * A dynamic field component visible by condition.
 * @param {object} props - The component props.
 * @returns {React.Component} The component.
 */
export const DynamicField = (props) => {
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

/**
 * A label component.
 * @param {object} props - The component props.
 * @param {string} props.children - The label text.
 * @returns {React.Component} The component.
 */
export const Label = ({ children }) => {
  return <label className={css['label']}>{children}</label>;
};