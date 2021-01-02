import classnames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Modal as IModal } from 'react-bootstrap';
import { RootStateOrAny, useSelector } from 'react-redux';

import { FilterTheme, FilterThemeOption, Theme, ThemeOption } from 'classes';
import {
  ButtonSpacer,
  CancelButton,
  DeleteButton
} from 'src/components/button';
import { Paragraph } from 'src/components/text';
import css from 'src/styles/components/Modal.module.scss';

import { createCanvasFromContent, downloadImage } from './canvas';
import { Field, FieldRow, Label, Switch } from './form';
import { RadioGroup } from './form/radio';

export const Modal = (props: ModalProps) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const {
    visible,
    modalHeader,
    modalBody,
    modalFooter,
    onHide,
    dialogClassName
  } = props;

  const Header = () => {
    if (!modalHeader) return null;
    return <IModal.Header>{modalHeader}</IModal.Header>;
  };

  const Body = () => {
    return (
      <IModal.Body
        className={css[modalHeader ? 'modal-body' : 'modal-body-only']}>
        {modalBody}
      </IModal.Body>
    );
  };

  const Footer = () => {
    if (!modalFooter) return null;
    return (
      <IModal.Footer className={css['modal-footer']}>
        {modalFooter}
      </IModal.Footer>
    );
  };

  return (
    <IModal
      show={visible}
      onHide={onHide}
      centered={true}
      dialogClassName={classnames(dialogClassName, `modal-dialog-${theme}`)}>
      <Header />
      <Body />
      <Footer />
    </IModal>
  );
};

/**
 * A modal for confirmation.
 * @param props - The props.
 * @param props.visible - Indicates if modal is showing or not.
 * @param props.message - The confirmation prompt message.
 * @param props.confirmFunction - The function called on clicking confirm.
 * @param props.confirmText - The text for the confirmation button.
 * @param props.closeFunction - The function called on clicking the close button.
 */
export const ConfirmModal = ({
  message,
  confirmFunction,
  confirmText,
  closeFunction,
  visible
}: ConfirmModalProps) => {
  return (
    <Modal
      visible={visible}
      onHide={closeFunction}
      modalBody={<Paragraph>{message}</Paragraph>}
      modalFooter={
        <ButtonSpacer>
          <DeleteButton onClick={confirmFunction}>{confirmText}</DeleteButton>
          <CancelButton onClick={closeFunction}>Cancel</CancelButton>
        </ButtonSpacer>
      }
    />
  );
};

export const ImageModal = ({
  content,
  closeFunction,
  visible
}: ImageModalProps) => {
  const [contentTheme, setContentTheme] = useState(ThemeOption.DARK);
  const [filterTheme, setFilterTheme] = useState(FilterThemeOption.PURPLE);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    drawCanvas();
    setCanvasMinHeight();
  }, [visible, contentTheme, filterTheme]);

  /** Set the minimum height of the canvas to prevent blips on redraw. */
  const setCanvasMinHeight = () => {
    const canvas = canvasRef.current;
    if (canvas !== null) {
      const height = canvas.offsetHeight * 2;
      canvas.style.minHeight = `${height}px`;
    }
  };

  /** Toggle the theme of the image content. */
  const toggleContentTheme = () => {
    const theme = Theme.switchTheme(contentTheme);
    setContentTheme(theme);
    drawCanvas();
  };

  /** Redraw the canvas with new properties. */
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const content = textRef.current;
    if (canvas !== null && content !== null) {
      createCanvasFromContent(canvas, content, contentTheme, filterTheme);
    }
  };

  /** Download the canvas as an image. */
  const downloadCanvasAsImage = () => {
    const canvas = canvasRef.current;
    if (canvas !== null) {
      downloadImage(canvas?.toDataURL());
    }
  };

  return (
    <Modal
      visible={visible}
      onHide={closeFunction}
      dialogClassName={'modal-image-dialog'}
      modalBody={
        <>
          <canvas ref={canvasRef} className={css['modal-image-canvas']} />
          <img />
          <div ref={textRef} hidden>
            <Paragraph>{content}</Paragraph>
          </div>
          <FieldRow className={css['modal-image-options']}>
            <Field xs={6}>
              <Label>Filter:</Label>
              <RadioGroup
                name={'filterTheme'}
                value={filterTheme}
                defaultValue={FilterThemeOption.PURPLE}
                options={FilterTheme.OPTIONS}
                onChange={(e) => {
                  setFilterTheme(e.target.value as FilterThemeOption);
                  drawCanvas();
                }}
              />
            </Field>
            <Field xs={6}>
              <Label>Theme:</Label>
              <Switch
                onChange={toggleContentTheme}
                checked={!Theme.isLight(contentTheme)}
                checkedIcon={'moon'}
                uncheckedIcon={'sun'}
              />
            </Field>
          </FieldRow>
        </>
      }
      modalFooter={
        <ButtonSpacer>
          <DeleteButton onClick={downloadCanvasAsImage}>Download</DeleteButton>
          <CancelButton onClick={closeFunction}>Cancel</CancelButton>
        </ButtonSpacer>
      }
    />
  );
};

interface ModalProps {
  visible: boolean;
  modalHeader?: JSX.Element;
  modalBody?: JSX.Element;
  modalFooter?: JSX.Element;
  onHide?: () => void;
  dialogClassName?: string;
}

interface ConfirmModalProps extends ModalProps {
  message: string;
  confirmFunction: () => void;
  confirmText: string;
  closeFunction: () => void;
}

interface ImageModalProps extends ModalProps {
  content: string;
  closeFunction: () => void;
}
