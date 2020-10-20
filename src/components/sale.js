import React, { useState, useRef } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import MUIRichTextEditor, { TMUIRichTextEditorRef } from 'mui-rte';
import { convertFromHTML, ContentState, convertToRaw } from 'draft-js'

const contentHTML = convertFromHTML('');
const state = ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap)
const content = JSON.stringify(convertToRaw(state))


export default function Sale({ boat, classes }) {
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [price, setPrice] = useState('');
  const [text, setText] = useState('');
  const ref = useRef<TMUIRichTextEditorRef>(null)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSave = (data: string) => {
        console.log(data)
  }

  const handlePriceChange = (e) => {
    if(e.target.reportValidity()) {
      console.log('price', e.target);
      setPrice(e.target.value);  
    } else {
      console.log('invalid price');
    }
  };

  function handleSnackBarClose() {
    setSnackBarOpen(false);
  }

  const handleSend = () => {
    //ref.current.save()
    console.log('set for sale', text, price);
    setOpen(false);
    setSnackBarOpen(true);
  };

  return (
        <form noValidate autoComplete="off">
          <Button className={classes.button} size="small"
            endIcon={<Icon>send</Icon>}
            variant="contained"
            color="primary" onClick={handleClickOpen}>
            Set this boat for sale
          </Button>
          <Dialog top open={open} onClose={handleCancel} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Set price and sales text</DialogTitle>
            <DialogContent>
              <TextField
                onChange={handlePriceChange}
                autoFocus
                margin="dense"
                label="Price"
                type="text"
                content=""
                fullWidth
              />
              <MUIRichTextEditor
              ref={ref}
              label="Start typing..."
              onSave={handleSave}
              controls={["bold", "italic", "underline", "link", "media", "numberList", "bulletList", "quote", "clear"]}
            />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancel} color="primary">
                Cancel
              </Button>
              <Button onClick={handleSend} color="primary" disabled={price === ''}>
                Send
              </Button>
            </DialogActions>
          </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={snackBarOpen}
        autoHideDuration={2000}
        onClose={handleSnackBarClose}
        message="Thanks."
        severity="success"
      />
    </form>
  );
}
