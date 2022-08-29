import classnames from 'classnames';
import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';
import type { ColProps } from 'react-bootstrap';
import { Col, Row } from 'react-bootstrap';
import type { RootStateOrAny } from 'react-redux';
import { useSelector } from 'react-redux';

import type { ReactComponent, ReactHook, Substitutions } from 'classes';
import {
  AdminButton,
  ButtonSpacer,
  CancelButton,
  ConfirmButton,
} from 'components/button';
import { Spacer, Toolbar } from 'components/layout';
import { Paragraph, Title } from 'components/text';
import css from 'styles/components/Form.module.scss';

import { Signature } from '../image';

export * from './checkbox';
export * from './fileselector';
export * from './input';
export * from './select';
export * from './textarea';

// TODO: Use single previewInfo object for title, text and footnote
// TODO: Rename previewText to previewContent
export function Form({
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
  onPreviewToggle,
}: FormProps) {
  const [isPreviewVisible, setPreviewVisibility] = useState(false);
  const [isInitialState, setIsInitialState] = useState(true);
  const [isConfirmed, setConfirmed] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeunload', restrictNavigation);
    return () => {
      window.removeEventListener('beforeunload', restrictNavigation);
    };
  }, [isConfirmed]);

  useEffect(() => {
    setIsInitialState(false);
  }, [isPreviewVisible]);

  /**
   * Prompt for confirmation before leaving the form in production.
   * @param e The event context.
   */
  const restrictNavigation = (e: Event) => {
    if (!isConfirmed && process.env.NODE_ENV !== 'development') {
      e.returnValue = true;
    }
  };

  const state = isInitialState
    ? 'initial'
    : isPreviewVisible
    ? 'preview-visible'
    : 'preview-hidden';
  const previewState = isPreviewVisible ? 'previewOn' : 'previewOff';

  const formClasses = classnames(
    css[`form`],
    css[`form--${state}`],
    formClassName?.[previewState],
  );
  const formEditorClasses = classnames(
    css[`form-editor`],
    css[`form-editor--${state}`],
    editorClassName?.[previewState],
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
}

function FormPreview({
  className,
  isPreviewVisible,
  previewTitle,
  previewText,
  previewFootnotes,
  substitutions = {},
}: FormPreview) {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const [isInitialState, setIsInitialState] = useState(true);

  useEffect(() => {
    if (isInitialState) {
      setIsInitialState(false);
    }
  }, [isPreviewVisible]);

  const state = isInitialState
    ? 'initial'
    : isPreviewVisible
    ? 'visible'
    : 'hidden';
  const classes = classnames(
    className,
    css[`form-preview-${theme}`],
    css[`form-preview--${state}`],
  );

  return (
    <div className={classes}>
      <Title className={css['form-preview__title']}>{previewTitle}</Title>
      <Paragraph
        className={css['form-preview__content']}
        substitutions={substitutions}>
        {previewText as string}
      </Paragraph>
      <Signature />
      <Paragraph className={css['form-preview__content']}>
        {previewFootnotes}
      </Paragraph>
    </div>
  );
}

function FormPreviewToggle({
  previewText,
  setPreviewVisibility,
  isPreviewVisible,
  onPreviewToggle,
}: FormPreviewToggle) {
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
}

export function FieldRow(props: ReactComponent) {
  const classes = classnames(css['form-field-row'], props.className);
  return (
    <Row {...props} className={classes}>
      {props.children}
    </Row>
  );
}

export function Field(props: ColProps): JSX.Element {
  const classes = classnames(css['form-field'], props.className);
  return (
    <Col {...props} className={classes}>
      {props.children}
    </Col>
  );
}

export function DynamicField(props: DynamicField) {
  const { precondition, dependency, xs, sm, md, lg, xl } = props;
  const [isVisible, setVisibility] = useState(true);

  useEffect(() => {
    setVisibility(precondition);
  }, [dependency]);

  const breakpoints = Object.assign({}, { xs, sm, md, lg, xl });
  const classes = classnames(css['form-field'], {
    [css['form-field--hidden']]: !isVisible,
  });

  return (
    <Col {...breakpoints} className={classes}>
      {props.children}
    </Col>
  );
}

export function Label({ children }: Label) {
  return <label className={css['label']}>{children}</label>;
}

interface DynamicField extends ColProps {
  precondition: boolean;
  dependency: unknown;
}

interface FormProps {
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
}

interface FormPreview {
  isPreviewVisible: boolean;
  previewTitle?: string;
  previewText?: string | boolean;
  previewFootnotes?: string;
  substitutions?: Substitutions;
  className?: FormCSSOptions;
}

interface FormPreviewToggle {
  isPreviewVisible: boolean;
  previewText: string | boolean;
  setPreviewVisibility: ReactHook<boolean>;
  onPreviewToggle?: (isVisible: boolean) => void;
}

interface Label {
  children: ReactNode;
}

type FormCSSOptions = {
  [key in PreviewOption]?: string;
};

enum PreviewOption {
  previewOn = 'previewOn',
  previewOff = 'previewOff',
}
