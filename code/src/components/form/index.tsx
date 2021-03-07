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
import { Paragraph, Title } from 'src/components/text';
import { Slider } from 'src/lib/library';
import css from 'src/styles/components/Form.module.scss';

import { Signature } from '../image';

export * from './checkbox';
export * from './fileselector';
export * from './input';
export * from './select';
export * from './textarea';

// TODO: Use single previewInfo object for title, text and footnote
// TODO: Rename previewText to previewContent
export const Form = ({
  confirmButtonText = 'Submit',
  confirmFunction,
  cancelFunction,
  isRequestPending,
  previewTitle,
  previewText = false,
  previewFootnotes,
  substitutions,
  children,
  formClassName,
  editorClassName,
  previewClassName,
  onPreviewToggle
}: FormProps) => {
  const [isPreviewVisible, setPreviewVisibility] = useState(false);
  const [isConfirmed, setConfirmed] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeunload', restrictNavigation);
    return () => {
      window.removeEventListener('beforeunload', restrictNavigation);
    };
  }, [isConfirmed]);

  /**
   * Prompt for confirmation before leaving the form in production.
   * @param e The event context.
   */
  const restrictNavigation = (e: Event) => {
    if (!isConfirmed && process.env.NODE_ENV !== 'development') {
      e.returnValue = true;
    }
  };

  const formClasses = classnames(
    formClassName?.[isPreviewVisible ? 'previewOn' : 'previewOff'],
    css[isPreviewVisible ? 'form-pv' : 'form']
  );
  const formEditorClasses = classnames(
    editorClassName?.[isPreviewVisible ? 'previewOn' : 'previewOff'],
    css[isPreviewVisible ? 'form-editor-pv' : 'form-editor']
  );

  return (
    <Spacer>
      <div className={formClasses}>
        <div className={formEditorClasses}>{children}</div>
        <FormPreview
          isPreviewVisible={isPreviewVisible}
          previewTitle={previewTitle}
          previewText={previewText}
          previewFootnotes={previewFootnotes}
          substitutions={substitutions}
          className={previewClassName}
        />
      </div>
      <Toolbar>
        <div className={css['form-footer-buttons']}>
          <FormPreviewToggle
            previewText={previewText}
            setPreviewVisibility={setPreviewVisibility}
            isPreviewVisible={isPreviewVisible}
            onPreviewToggle={onPreviewToggle}
          />
          <ButtonSpacer className={css['form-footer-button-spacer']}>
            <ConfirmButton
              onClick={() => {
                setConfirmed(true);
                confirmFunction!();
              }}
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
  className,
  isPreviewVisible,
  previewTitle,
  previewText,
  previewFootnotes,
  substitutions = {}
}: FormPreview) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const classes = classnames(className, css[`form-preview-${theme}`]);

  return (
    <Slider
      determinant={isPreviewVisible}
      duration={300}
      direction={'right'}
      className={classes}
      style={{ display: isPreviewVisible ? 'block' : 'none' }}>
      <Title className={css['form-preview__title']}>{previewTitle}</Title>
      <Paragraph
        className={css['form-preview__text']}
        substitutions={substitutions}>
        {previewText as string}
      </Paragraph>
      <Signature />
      <Paragraph className={css['form-preview__text']}>
        {previewFootnotes}
      </Paragraph>
    </Slider>
  );
};

const FormPreviewToggle = ({
  previewText,
  setPreviewVisibility,
  isPreviewVisible,
  onPreviewToggle
}: FormPreviewToggle) => {
  // TODO: Make previewText just string type
  if (typeof previewText !== 'string') return null;

  const togglePreview = () => {
    setPreviewVisibility(!isPreviewVisible);
    onPreviewToggle?.(!isPreviewVisible);
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
  const classes = classnames(css['form-field'], {
    [css['form-field--hidden']]: !isVisible
  });

  return (
    <Col {...breakpoints} className={classes}>
      {props.children}
    </Col>
  );
};

export const Label = ({ children }: Label) => {
  return <label className={css['label']}>{children}</label>;
};

interface DynamicField extends ColProps {
  precondition: boolean;
  dependency: unknown;
}

type FormProps = {
  children: ReactNode;
  isRequestPending?: boolean;
  previewTitle?: string;
  previewText?: string | boolean;
  previewFootnotes?: string;
  substitutions?: Substitutions;
  formClassName?: FormCSSOptions;
  editorClassName?: FormCSSOptions;
  previewClassName?: FormCSSOptions;
  confirmButtonText?: string;
  confirmFunction?: () => void;
  cancelFunction?: () => void;
  onPreviewToggle?: (isVisible: boolean) => void;
};

type FormPreview = {
  isPreviewVisible: boolean;
  previewTitle?: string;
  previewText?: string | boolean;
  previewFootnotes?: string;
  substitutions?: Substitutions;
  className?: FormCSSOptions;
};

type FormPreviewToggle = {
  isPreviewVisible: boolean;
  previewText: string | boolean;
  setPreviewVisibility: ReactHook<boolean>;
  onPreviewToggle?: (isVisible: boolean) => void;
};

type Label = {
  children: ReactNode;
};

type FormCSSOptions = {
  [key in PreviewOption]?: string;
};

enum PreviewOption {
  previewOn = 'previewOn',
  previewOff = 'previewOff'
}
