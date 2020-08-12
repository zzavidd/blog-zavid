import React from 'react';
import { Modal as IModal } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { CancelButton, DeleteButton } from 'components/button.js';
import { Paragraph } from 'components/text.js';
import css from 'styles/components/Modal.module.scss';

export const Modal = (props) => {
  const { visible, modalHeader, modalBody, modalFooter, onHide } = props;

  const theme = useSelector(({ theme }) => theme);

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
    return <IModal.Footer className={css['modal-footer']}>{modalFooter}</IModal.Footer>;
  };

  return (
    <IModal
      show={visible}
      onHide={onHide}
      centered={true}
      dialogClassName={`modal-dialog-${theme}`}
      {...props}>
      <Header />
      <Body />
      <Footer />
    </IModal>
  );
};

export const ConfirmModal = ({
  message,
  confirmFunction,
  confirmText,
  closeFunction,
  visible
}) => {
  return (
    <Modal
      visible={visible}
      onHide={closeFunction}
      modalBody={<Paragraph>{message}</Paragraph>}
      modalFooter={
        <div >
          <DeleteButton onClick={confirmFunction}>{confirmText}</DeleteButton>
          <CancelButton onClick={closeFunction}>Cancel</CancelButton>
        </div>
      }
    />
  );
};
