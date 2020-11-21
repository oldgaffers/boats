
import React from 'react';
import Dialog from '@material-ui/core/Dialog';

export default function PhotoForm({ onClose, boat, open, classes }) {
    
    const url = `https://form.jotform.com/203251962423046?ogaNumber=${boat.oga_no}`;
    
    return (
      <Dialog classes={{ paper: classes.jotDialogPaper }} fullWidth onClose={onClose} open={open}>
        <iframe title='JotFormIFrame-203251962423046' id="JotFormIFrame-203251962423046"
          onload="window.parent.scrollTo(0,0)"
          allowtransparency="true"
          allowfullscreen="true"
          src={url}
          frameborder="0"
          style={ {width: '1px', minWidth: '100%', minHeight: '100%', height:'8000px', border:'none'} }
          scrolling="yes"
        >
        </iframe>
      </Dialog>
    );
  }
  