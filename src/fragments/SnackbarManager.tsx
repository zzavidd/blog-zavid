import type { AlertColor } from '@mui/material';
import { Alert, Fade } from '@mui/material';
import type { CustomContentProps } from 'notistack';
import { SnackbarProvider } from 'notistack';
import React from 'react';

export default function SnackbarManager({ children }: React.PropsWithChildren) {
  return (
    <SnackbarProvider
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      autoHideDuration={6000}
      Components={{
        success: Snack,
        warning: Snack,
        error: Snack,
        info: Snack,
      }}
      maxSnack={2}
      preventDuplicate={true}
      TransitionComponent={Fade}
      transitionDuration={500}>
      {children}
    </SnackbarProvider>
  );
}

const Snack = React.forwardRef<HTMLDivElement, CustomContentProps>(
  ({ message, variant }, ref) => {
    return (
      <Alert
        variant={'standard'}
        severity={variant as AlertColor}
        ref={ref}
        data-testid={`zb.alert.${variant}`}>
        {message}
      </Alert>
    );
  },
);
