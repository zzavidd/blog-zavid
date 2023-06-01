import type { AlertColor } from '@mui/material';
import { Alert, Fade } from '@mui/material';
import type { CustomContentProps } from 'notistack';
import { SnackbarProvider } from 'notistack';
import React from 'react';

export default function SnackbarManager({ children }: React.PropsWithChildren) {
  const snackbarProps = {
    'data-testid': 'zb.alert',
  } as React.HTMLAttributes<HTMLDivElement>;
  return (
    <SnackbarProvider
      anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      autoHideDuration={6000}
      Components={{ success: Snack }}
      maxSnack={2}
      preventDuplicate={true}
      SnackbarProps={snackbarProps}
      TransitionComponent={Fade}>
      {children}
    </SnackbarProvider>
  );
}

const Snack = React.forwardRef<HTMLDivElement, CustomContentProps>(
  ({ message, variant }, ref) => {
    return (
      <Alert variant={'standard'} severity={variant as AlertColor} ref={ref}>
        {message}
      </Alert>
    );
  },
);
