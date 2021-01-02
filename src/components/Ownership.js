import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

export default function Ownership({ classes, onCancel, onSave, boat }) {

  return (
    <Paper className={classes.paper}>
      <Typography variant="h5" align="center">
        Editing the ownership and/or for sale information.
      </Typography>
      <Typography variant="h6" align="center">
        Note - only owners or the editors should use this option
      </Typography>
    </Paper>
  );
}
