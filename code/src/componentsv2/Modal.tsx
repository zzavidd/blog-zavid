import React from 'react';

import CPX from 'stylesv2/Components.styles';

export function Modal({ header, body, footer, ...props }: ModalProps) {
  return (
    <CPX.Modal.Container {...props}>
      <CPX.Modal.Dialog>
        {header ? <CPX.Modal.Header>{header}</CPX.Modal.Header> : null}
        <CPX.Modal.Body>{body}</CPX.Modal.Body>
        {footer ? <CPX.Modal.Footer>{footer}</CPX.Modal.Footer> : null}
      </CPX.Modal.Dialog>
    </CPX.Modal.Container>
  );
}

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  body: React.ReactNode;
  visible: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}
