import React from 'react';
import { Modal as IModal } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { ButtonSpacer, CancelButton, DeleteButton } from 'components/button.js';
import { Paragraph } from 'components/text.js';
import css from 'styles/components/Modal.module.scss';

/**
 * A modal component.
 * @param {object} props - The props.
 * @param {boolean} props.visible - Indicates if modal is showing or not.
 * @param {React.Component} props.modalHeader - Content for the modal's header.
 * @param {React.Component} props.modalBody - Content for the modal's body.
 * @param {React.Component} props.modalFooter - Content for the modal's footer.
 * @param {Function} props.onHide - The function called when clicking outside of the modal.
 * @returns {React.Component} The component.
 */
export const Modal = (props) => {
  const theme = useSelector(({ theme }) => theme);
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
 * @returns {React.Component} The component.
 */
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
        <ButtonSpacer>
          <DeleteButton onClick={confirmFunction}>{confirmText}</DeleteButton>
          <CancelButton onClick={closeFunction}>Cancel</CancelButton>
        </ButtonSpacer>
      }
    />
  );
};
