import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

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
