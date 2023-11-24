import { LoadingButton } from '@mui/lab';
import type { DialogProps, SxProps, Theme } from '@mui/material';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';

const buttonSx: SxProps<Theme> = { minWidth: (t) => t.spacing(10) };

export function ActionDialog({
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isActionDestructive,
  isActionLoading,
  ...props
}: ActionDialogProps) {
  return (
    <Dialog maxWidth={'sm'} fullWidth={true} {...props}>
      <DialogContent sx={{ padding: (t) => t.spacing(5, 5, 3, 5) }}>
        {children}
      </DialogContent>
      <DialogActions sx={{ padding: (t) => t.spacing(3, 5, 5, 5) }}>
        <Button variant={'outlined'} onClick={onCancel} sx={buttonSx}>
          {cancelText}
        </Button>
        <LoadingButton
          variant={'contained'}
          onClick={onConfirm}
          color={isActionDestructive ? 'secondary' : 'primary'}
          loading={isActionLoading}
          sx={buttonSx}>
          {confirmText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

interface ActionDialogProps extends DialogProps {
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isActionDestructive?: boolean;
  isActionLoading?: boolean;
}
