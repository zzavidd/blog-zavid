import { LoadingButton } from '@mui/lab';
import type { DialogProps, SxProps, Theme } from '@mui/material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@mui/material';

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
    <Dialog {...props} maxWidth={'sm'} fullWidth={true}>
      <DialogContent sx={{ padding: (t) => t.spacing(5, 4, 5, 5) }}>
        <Typography variant={'body1'}> {children}</Typography>
      </DialogContent>
      <DialogActions sx={{ padding: (t) => t.spacing(4, 5, 5, 5) }}>
        <Button variant={'outlined'} onClick={onCancel} sx={buttonSx}>
          {cancelText}
        </Button>
        <LoadingButton
          variant={'contained'}
          onClick={onConfirm}
          color={isActionDestructive ? 'error' : 'primary'}
          loading={isActionLoading}
          sx={buttonSx}>
          {confirmText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

interface ActionDialogProps extends DialogProps {
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isActionDestructive?: boolean;
  isActionLoading?: boolean;
}
