import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import RichTextEditor from './RichTextEditor';

export default function Descriptions({ classes, onCancel, onSave, short, full }) {

  const [textShort, setTextShort] = useState(short);
  const [textFull, setTextFull] = useState(full);
  
  const handleUpdateShort = (html) => {
    setTextShort(html);
  };

  const handleUpdateFull = (html) => {
    setTextFull(html);
  };

  const handleSave = () => {
    onSave(textShort, textFull);
  }

  return (
    <Paper className={classes.paper}>
      <Typography component="h1" variant="h6" align="left">
        Short Description
      </Typography>
      <RichTextEditor variant='min' html={textShort} onUpdate={handleUpdateShort} />
      <Typography component="h1" variant="h6" align="left">
        Full Description
      </Typography>
      <RichTextEditor variant='max' html={textFull} onUpdate={handleUpdateFull} />
      <Button variant="outlined" color="primary" onClick={onCancel}>Cancel</Button>
      <Button variant="outlined" color="primary" onClick={handleSave}>Save</Button>
    </Paper>
  );
}
