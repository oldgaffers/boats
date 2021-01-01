import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

export default function Rig({ classes, onCancel, onSave, boat }) {

  return (
    <Paper className={classes.paper}>
      <Typography component="h1" variant="h5" align="center">
        Editing the rig and other basic details
      </Typography>
    </Paper>
  );
}
