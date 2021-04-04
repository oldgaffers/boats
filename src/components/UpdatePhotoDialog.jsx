import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import FormWithFileUpload from './uploadphotos';

export const theme = createMuiTheme()

Object.assign(theme, {
  overrides: {
    root: {
        width: "100%",
        border: "1px",
        marginBottom: 30,
        paddingLeft: '50px',
        paddingRight: '50px'
    }
  }
});

const useStyles = makeStyles((theme) => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: "25px 50px 75px 100px",// theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: "30px 30px 30px 30px",//theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

export default function UpdatePhotoDialog({ boat, onClose, open }) {
  const classes = useStyles();

  const handleCancel = () => {
    onClose();
  }

  const handleSave = (values, fileList) => { 
    onClose(values, fileList);
  };

  return (
    <Dialog aria-labelledby="updateboat-dialog-title" open={open}>
      <Paper className={classes.paper}>
      <FormWithFileUpload classes={classes} onCancel={handleCancel} onSave={handleSave} boat={boat}/>
      </Paper>
    </Dialog>
  );
}


UpdatePhotoDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
