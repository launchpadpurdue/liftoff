import React from 'react';

import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@material-ui/core';

type AlertDialogProps = {
  title: string;
  message: string;
  open: boolean;
  onClose: () => void;
};
export default function AlertDialog({
  title,
  message,
  open,
  onClose
}: AlertDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus color="primary" onClick={onClose}>
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  );
}
