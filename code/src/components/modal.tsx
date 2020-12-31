import classnames from 'classnames';
import React, { useRef } from 'react';
import { Modal as IModal } from 'react-bootstrap';
import { RootStateOrAny, useSelector } from 'react-redux';

import {
  ButtonSpacer,
  CancelButton,
  DeleteButton
} from 'src/components/button';
import { Paragraph } from 'src/components/text';
import css from 'src/styles/components/Modal.module.scss';

import { copyImageToCanvas } from './canvas';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const confirm = () => {
    const canvas = canvasRef.current;
    const content = textRef.current;
    if (canvas !== null && content !== null) {
      copyImageToCanvas(canvas, content);
    }
  };

  return (
    <Modal
      visible={visible}
      onHide={closeFunction}
      dialogClassName={'modal-image-dialog'}
      modalBody={
        <>
          <div className={css['modal-image-filter']}>
            <div ref={textRef} className={css['modal-image-text']}>
              <Paragraph>{content}</Paragraph>
            </div>
          </div>
          <canvas ref={canvasRef} className={css['modal-image-canvas']} />
        </>
      }
      modalFooter={
        <ButtonSpacer>
          <DeleteButton onClick={confirm}>Download</DeleteButton>
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
  onHide?: any;
  dialogClassName?: string;
}

interface ConfirmModalProps extends ModalProps {
  message: string;
  confirmFunction: any;
  confirmText: string;
  closeFunction: any;
}

interface ImageModalProps extends ModalProps {
  content: string;
  closeFunction: any;
}
