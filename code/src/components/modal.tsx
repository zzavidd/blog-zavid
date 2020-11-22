import React from 'react';
import { Modal as IModal } from 'react-bootstrap';
import { RootStateOrAny, useSelector } from 'react-redux';

import { ButtonSpacer, CancelButton, DeleteButton } from 'src/components/button';
import { Paragraph } from 'src/components/text';
import css from 'src/styles/components/Modal.module.scss';


export const Modal = (props: Modal) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const { visible, modalHeader, modalBody, modalFooter, onHide } = props;

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
      dialogClassName={`modal-dialog-${theme}`}>
      <Header />
      <Body />
      <Footer />
    </IModal>
  );
};

/**
 * A modal for confirmation.
 * @param {object} props - The props.
 * @param {boolean} props.visible - Indicates if modal is showing or not.
 * @param {string} props.message - The confirmation prompt message.
 * @param {Function} props.confirmFunction - The function called on clicking confirm.
 * @param {string} props.confirmText - The text for the confirmation button.
 * @param {Function} props.closeFunction - The function called on clicking the close button.
 * @returns {JSX.Element} The component.
 */
export const ConfirmModal = ({
  message,
  confirmFunction,
  confirmText,
  closeFunction,
  visible
}: ConfirmModal) => {
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


interface Modal {
  visible: boolean
  modalHeader?: JSX.Element
  modalBody?: JSX.Element
  modalFooter?: JSX.Element
  onHide?: any
}

interface ConfirmModal extends Modal {
  message: string
  confirmFunction: any
  confirmText: string
  closeFunction: any
}