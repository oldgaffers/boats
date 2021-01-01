import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import RichTextEditor from './RichTextEditor';

export default function Descriptions({ classes, onCancel, onSave, short, full }) {

  console.log('Descriptions', short, full);
  
  const handleUpdateShort = (args) => {
    console.log(args);
  };

  const handleUpdateFull = (args) => {
    console.log(args);
  };

  return (
    <Paper className={classes.paper}>
      <Typography component="h1" variant="h6" align="center">
        Short Description
      </Typography>
      <RichTextEditor variant='min' html={short} onUpdate={handleUpdateShort} />
      <Typography component="h1" variant="h6" align="center">
        Full Description
      </Typography>
      <RichTextEditor variant='max' html={full} onUpdate={handleUpdateFull} />
    </Paper>
  );
}
