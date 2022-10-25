import React from 'react';

import ModalStyle from 'styles/Components/Modal.styles';

export function Modal({ header, body, footer, ...props }: ModalProps) {
  return (
    <ModalStyle.Container {...props}>
      <ModalStyle.Dialog>
        {header ? <ModalStyle.Header>{header}</ModalStyle.Header> : null}
        <ModalStyle.Body>{body}</ModalStyle.Body>
        {footer ? <ModalStyle.Footer>{footer}</ModalStyle.Footer> : null}
      </ModalStyle.Dialog>
    </ModalStyle.Container>
  );
}

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  body: React.ReactNode;
  visible: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}
