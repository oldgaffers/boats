import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export default function Everything({ classes, onCancel, onSave, boat }) {

  return (
    <Paper className={classes.paper}>
      <Typography component="h1" variant="h5" align="center">
        step through all fields
      </Typography>
    </Paper>
  );
}
