import React from 'react';

import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@material-ui/core';

type ConfirmationDialogProps = {
  title: string;
  message: string;
  open: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
};

export default function ConfirmationDialog({
  title,
  message,
  open,
  onConfirm,
  onDismiss
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onClose={onDismiss}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDismiss}>Cancel</Button>
        <Button autoFocus color="primary" onClick={onConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
